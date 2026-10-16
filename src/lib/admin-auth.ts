import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * 원장님(관리자) 로그인.
 *
 * - 아이디·비밀번호는 코드나 깃허브에 적지 않고 Vercel 환경변수에만 둡니다.
 *     ADMIN_ID            관리자 아이디
 *     ADMIN_PASSWORD      관리자 비밀번호 (8자 이상)
 *     ADMIN_SESSION_SECRET 로그인 도장 서명용 긴 임의 문자열 (16자 이상)
 * - 로그인하면 12시간짜리 서명된 쿠키를 줍니다. (JS로 못 읽는 httpOnly 쿠키)
 * - 비밀번호를 바꾸면 이전에 로그인했던 기기는 자동으로 로그아웃됩니다.
 * - 환자가 글을 쓰는 기능은 없습니다. 로그인 화면은 /admin 하나뿐입니다.
 */

const COOKIE_NAME = "admin_session";
const SESSION_HOURS = 12;

function env() {
  return {
    id: process.env.ADMIN_ID ?? "",
    password: process.env.ADMIN_PASSWORD ?? "",
    secret: process.env.ADMIN_SESSION_SECRET ?? "",
  };
}

/** 관리자 설정(아이디·비밀번호·서명 비밀값)이 모두 들어 있는지 */
export function isAdminConfigured() {
  const { id, password, secret } = env();
  return id.length >= 3 && password.length >= 8 && secret.length >= 16;
}

/** 길이가 달라도 시간 차이로 정답을 짐작할 수 없게 비교합니다. */
function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkCredentials(id: string, password: string) {
  if (!isAdminConfigured()) return false;
  const expected = env();
  // 둘 다 비교해서, 아이디가 틀렸는지 비밀번호가 틀렸는지 알 수 없게 합니다.
  const idOk = safeEqual(id, expected.id);
  const pwOk = safeEqual(password, expected.password);
  return idOk && pwOk;
}

/** 서명 키 = 비밀값 + 비밀번호 → 비밀번호를 바꾸면 기존 로그인이 모두 무효 */
function signingKey() {
  const { secret, password } = env();
  return `${secret}::${password}`;
}

function sign(payload: string) {
  return createHmac("sha256", signingKey()).update(payload).digest("hex");
}

function createToken() {
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = `${expires}.${randomBytes(12).toString("hex")}`;
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined) {
  if (!token || !isAdminConfigured()) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [expires, nonce, signature] = parts;
  const payload = `${expires}.${nonce}`;
  if (!safeEqual(signature, sign(payload))) return false;
  return Number(expires) > Date.now();
}

/** 지금 요청이 로그인한 관리자의 것인지 */
export async function isAdmin() {
  const jar = await cookies();
  return verifyToken(jar.get(COOKIE_NAME)?.value);
}

export async function startAdminSession() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, createToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function endAdminSession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

/* ── 로그인 시도 횟수 제한 (간단한 방어) ──────────────────────────
   서버가 여러 대로 나뉘면 완벽하진 않지만, 무작위 대입을 크게 늦춥니다. */
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 5;

export function isLockedOut(ip: string) {
  const entry = attempts.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.first > WINDOW_MS) {
    attempts.delete(ip);
    return false;
  }
  return entry.count >= MAX_FAILS;
}

export function recordFailure(ip: string) {
  const entry = attempts.get(ip);
  if (!entry || Date.now() - entry.first > WINDOW_MS) {
    attempts.set(ip, { count: 1, first: Date.now() });
  } else {
    entry.count += 1;
  }
}

export function clearFailures(ip: string) {
  attempts.delete(ip);
}
