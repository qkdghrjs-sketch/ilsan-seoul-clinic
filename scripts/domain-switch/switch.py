"""
iseoulmed.com → 새 홈페이지(Vercel ilsan-seoul-clinic) 자동 전환 (2026-11-08 21:00 예약)

준비 상태(2026-11-02 설정):
  - Vercel 팀에 iseoulmed.com 등록, Vercel DNS 에 A 레코드 2개(@, www → 옛 서버 211.174.60.19)
    → 네임서버를 Vercel 로 바꿔도 옛 홈페이지가 그대로 보임
  - 원장님 본인인증으로 아이네임즈 네임서버를 ns1/ns2.vercel-dns.com 으로 바꿔 둬야 함 (사람이 함)

모드:
  py switch.py --precheck   네임서버가 Vercel 로 바뀌었는지만 확인하고 텔레그램 알림 (아무것도 안 바꿈)
  py switch.py --dry-run    전환 과정을 바꾸지 않고 점검만 (조회수 읽기, 레코드 찾기)
  py switch.py --run        실제 전환:
     1) 네임서버 확인 (Vercel 아니면 아무것도 안 하고 알림)
     2) 옛 게시판 조회수 다시 읽어 src/lib/views.ts 갱신 → 커밋·푸시 (실패해도 계속)
     3) 프로젝트에 iseoulmed.com · www.iseoulmed.com 연결
     4) 옛 서버를 가리키는 A 레코드 삭제 → 주소가 새 홈페이지로
     5) 운영 재배포 (사이트 대표 주소가 iseoulmed.com 으로 바뀜)
     6) 최대 45분 동안 https 로 열리는지 확인
     7) 실패하면 A 레코드를 다시 만들어 옛 홈페이지로 복구
  결과는 텔레그램(브리핑 알림과 같은 MAKE_WEBHOOK_URL)과 switch_log.txt 에 남김.
비밀값은 이 파일에 없음 (Vercel·git 은 이 PC 로그인 상태를 씀).
"""
import json
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.request
from datetime import datetime
from pathlib import Path

DOMAIN = "iseoulmed.com"
HOSTS = ["iseoulmed.com", "www.iseoulmed.com"]
PROJECT = "ilsan-seoul-clinic"
OLD_IP = "211.174.60.19"
REPO = Path(__file__).resolve().parents[2]
LOG = Path(__file__).resolve().parent / "switch_log.txt"
VIEWS_TS = REPO / "src" / "lib" / "views.ts"
VERCEL = shutil.which("vercel") or shutil.which("vercel.cmd") or r"C:\Users\qkdgh\AppData\Roaming\npm\vercel.cmd"
GIT = shutil.which("git") or "git"
CURL = r"C:\Windows\System32\curl.exe"


def log(msg: str):
    line = f"[{datetime.now():%Y-%m-%d %H:%M:%S}] {msg}"
    print(line, flush=True)
    with LOG.open("a", encoding="utf-8") as f:
        f.write(line + "\n")


def notify(title: str, text: str):
    url = os.environ.get("MAKE_WEBHOOK_URL")
    if not url:
        log(f"(알림 못 보냄: MAKE_WEBHOOK_URL 없음) {title} {text}")
        return
    body = json.dumps({"kind": "agent", "title": title, "checked": 0, "fail_count": 1, "fails": text}).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers={"content-type": "application/json; charset=utf-8"})
    try:
        urllib.request.urlopen(req, timeout=20).read()
        log(f"알림 보냄: {title}")
    except Exception as e:  # noqa: BLE001
        log(f"알림 실패: {e}")


def run(cmd: list[str], check=True, timeout=600) -> str:
    log("$ " + " ".join(c if c else "''" for c in cmd))
    p = subprocess.run(cmd, cwd=REPO, capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=timeout)
    out = (p.stdout or "") + (p.stderr or "")
    if p.returncode != 0:
        log(f"  → 실패({p.returncode}): {out.strip()[-800:]}")
        if check:
            raise RuntimeError(f"명령 실패: {' '.join(cmd[:3])}")
    return out


def nslookup(name: str, server: str, rtype="A") -> str:
    p = subprocess.run(["nslookup", f"-type={rtype}", name, server], capture_output=True, text=True,
                       encoding="cp949", errors="replace", timeout=30)
    return p.stdout + p.stderr


def nameservers_ok() -> tuple[bool, str]:
    out = nslookup(DOMAIN, "8.8.8.8", "NS")
    found = sorted(set(re.findall(r"nameserver = (\S+)", out)))
    return (bool(found) and all("vercel-dns.com" in n for n in found), ", ".join(found) or "조회 실패")


def vercel_ips(host: str) -> list[str]:
    out = nslookup(host, "ns1.vercel-dns.com", "A")
    # 첫 Address 줄은 질의한 서버 자신이라 이름 줄 뒤만 봄
    tail = out.split("Name:", 1)[1] if "Name:" in out else ""
    return re.findall(r"(\d+\.\d+\.\d+\.\d+)", tail)


def old_records() -> list[str]:
    out = run([VERCEL, "dns", "ls", DOMAIN])
    return re.findall(rf"(rec_\w+)\s+(?:\S+\s+)?A\s+{re.escape(OLD_IP)}", out)


# ── 2) 옛 조회수 다시 읽기 ──────────────────────────────
def read_old_views() -> dict[str, int]:
    req = urllib.request.Request(f"http://{OLD_IP}/board/board_list.asp", headers={"Host": DOMAIN, "User-Agent": "Mozilla/5.0"})
    html = urllib.request.urlopen(req, timeout=30).read().decode("cp949", "replace")
    views = {}
    for row in html.split("<tr")[1:]:
        m = re.search(r"board_view\.asp\?srno=(\d+)", row)
        nums = re.findall(r'<td align="center">\s*(\d+)\s*</td>', row)
        if m and nums:
            views[m.group(1)] = int(nums[-1])
    return views


def update_views(dry: bool) -> str:
    try:
        new = read_old_views()
    except Exception as e:  # noqa: BLE001
        return f"옛 조회수 읽기 실패({e}) — 기존 숫자 유지"
    src = VIEWS_TS.read_text(encoding="utf-8")
    changes, text = [], src
    for sid, n in sorted(new.items(), key=lambda x: int(x[0])):
        m = re.search(rf'"{sid}": (\d+),', text)
        if not m:
            continue
        old = int(m.group(1))
        if n > old:
            text = text.replace(m.group(0), f'"{sid}": {n},', 1)
            changes.append(f"{sid}번 {old:,}→{n:,}")
    if len(new) < 8:
        return f"옛 게시판에서 {len(new)}편만 읽힘 — 기존 숫자 유지"
    if not changes:
        return "옛 조회수 변동 없음"
    if dry:
        return "조회수 갱신 예정(점검만): " + ", ".join(changes)
    text = text.replace("목록을 2026-11-02 에 읽은 값", f"목록을 {datetime.now():%Y-%m-%d} 전환 직전에 다시 읽은 값")
    VIEWS_TS.write_text(text, encoding="utf-8", newline="\n")
    msg_file = LOG.parent / "_commit_msg.txt"
    msg_file.write_text("chore: 주소 전환 직전 옛 홈페이지 에세이 조회수 다시 맞춤\n\n" + "\n".join(changes)
                        + "\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\n", encoding="utf-8")
    run([GIT, "add", "src/lib/views.ts"])
    run([GIT, "commit", "-F", str(msg_file)])
    msg_file.unlink(missing_ok=True)
    run([GIT, "push", "origin", "main"], check=False)
    return "조회수 갱신: " + ", ".join(changes)


# ── 6) 열리는지 확인 ──────────────────────────────────
def site_ok(host: str) -> tuple[bool, str]:
    ips = [ip for ip in vercel_ips(host) if ip != OLD_IP]
    if not ips:
        return False, f"{host}: 아직 Vercel 주소가 아님"
    ip = ips[0]
    p = subprocess.run([CURL, "-s", "-o", "-", "-w", "\n%{http_code}", "--max-time", "30",
                        "--resolve", f"{host}:443:{ip}", f"https://{host}/"],
                       capture_output=True, timeout=60)
    body = p.stdout.decode("utf-8", "replace")
    code = body.rsplit("\n", 1)[-1].strip()
    if p.returncode != 0:
        return False, f"{host}: https 연결 안 됨(curl {p.returncode}, 보안인증서 발급 대기일 수 있음)"
    if code != "200" or "일산서울내과" not in body:
        return False, f"{host}: 응답 {code}"
    return True, f"{host}: 정상(200, {ip})"


def rollback():
    log("복구: 옛 서버 A 레코드 다시 만들기")
    have = old_records()
    if len(have) >= 2:
        log("  이미 있음")
        return
    run([VERCEL, "dns", "add", DOMAIN, "", "A", OLD_IP], check=False)
    run([VERCEL, "dns", "add", DOMAIN, "www", "A", OLD_IP], check=False)


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "--dry-run"
    log(f"===== 시작 {mode} =====")
    ok, ns = nameservers_ok()
    log(f"네임서버: {ns} → {'Vercel 맞음' if ok else 'Vercel 아님'}")

    if mode == "--precheck":
        if ok:
            notify("일산서울내과 주소 전환 준비 완료", f"네임서버가 Vercel 로 바뀌어 있습니다({ns}). 오늘 밤 9시에 자동 전환합니다.")
        else:
            notify("⚠ 일산서울내과 주소 전환 준비 안 됨",
                   f"iseoulmed.com 네임서버가 아직 {ns} 입니다. 아이네임즈에서 ns1.vercel-dns.com / ns2.vercel-dns.com 으로 바꿔야 오늘 밤 9시 자동 전환이 됩니다.")
        return

    dry = mode != "--run"
    if not ok and not dry:
        notify("⚠ 일산서울내과 주소 전환 못 함",
               f"네임서버가 아직 {ns} 라서 아무것도 바꾸지 않았습니다. 옛 홈페이지가 그대로 열립니다.")
        return

    views_msg = update_views(dry)
    log(views_msg)
    recs = old_records()
    log(f"옛 서버 A 레코드: {recs}")
    if dry:
        log("점검만 하고 끝 (바꾼 것 없음)")
        return

    try:
        for host in HOSTS:
            run([VERCEL, "domains", "add", host, PROJECT], check=False)
        for rec in recs:
            out = run([VERCEL, "dns", "rm", rec, "--yes"])
            log("  → " + out.strip().replace("\n", " | ")[-400:])
        left = old_records()
        if left:
            raise RuntimeError(f"옛 서버 A 레코드가 안 지워짐: {left}")
        log("옛 서버 A 레코드 삭제 확인")
        run([GIT, "pull", "--ff-only", "origin", "main"], check=False)
        run([VERCEL, "deploy", "--prod", "--yes"], timeout=900)
    except Exception as e:  # noqa: BLE001
        log(f"전환 중 오류: {e}")
        rollback()
        notify("⚠ 일산서울내과 주소 전환 실패 — 옛 홈페이지로 복구", f"{e}\n기록: {LOG}")
        return

    deadline = time.time() + 45 * 60
    last = ""
    while time.time() < deadline:
        results = [site_ok(h) for h in HOSTS]
        last = " / ".join(r[1] for r in results)
        log(last)
        if all(r[0] for r in results):
            # 옛 에세이 링크도 확인
            p = subprocess.run([CURL, "-s", "-o", os.devnull, "-w", "%{http_code} %{redirect_url}",
                                "--resolve", f"{DOMAIN}:443:{vercel_ips(DOMAIN)[0]}",
                                f"https://{DOMAIN}/board/board_view.asp?srno=5"], capture_output=True, text=True, timeout=60)
            log(f"옛 에세이 링크: {p.stdout}")
            notify("✅ 일산서울내과 새 홈페이지 전환 완료",
                   f"https://iseoulmed.com 이 새 홈페이지로 열립니다. ({last})\n{views_msg}\n"
                   "휴대폰·PC에 따라 몇 시간까지 옛 화면이 보일 수 있습니다.")
            log("===== 완료 =====")
            return
        time.sleep(60)

    rollback()
    notify("⚠ 일산서울내과 주소 전환 실패 — 옛 홈페이지로 복구",
           f"45분 안에 새 홈페이지가 열리지 않아 옛 홈페이지로 되돌렸습니다. 마지막 상태: {last}\n기록: {LOG}")
    log("===== 실패 → 복구 =====")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:  # noqa: BLE001
        log(f"예상 못 한 오류: {e}")
        if "--run" in sys.argv:
            try:
                rollback()
            except Exception as e2:  # noqa: BLE001
                log(f"복구도 실패: {e2}")
        notify("⚠ 일산서울내과 주소 전환 스크립트 오류", f"{e}\n기록: {LOG}")
