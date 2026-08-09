import crypto from "crypto";

/**
 * Hashes a password using Node.js pbkdf2 (Runs in Node.js runtime only).
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifies a password using Node.js pbkdf2 (Runs in Node.js runtime only).
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, hash] = storedHash.split(":");
    if (!salt || !hash) return false;
    const testHash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
    return hash === testHash;
  } catch (e) {
    console.error("Password verification error:", e);
    return false;
  }
}
