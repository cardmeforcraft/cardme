// Key imports for Web Cryptography API
async function getCryptoKey(secret: string) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  return globalThis.crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// Convert a base64url string to base64
function base64urlToBase64(str: string): string {
  let next = str.replace(/-/g, "+").replace(/_/g, "/");
  while (next.length % 4) {
    next += "=";
  }
  return next;
}

// Convert a base64 string to base64url
function base64ToBase64url(str: string): string {
  return str.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

/**
 * Signs a payload with a secret using HMAC-SHA256 (Web Crypto compatible, runs in Node and Edge).
 */
export async function signToken(payload: any, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const header = base64ToBase64url(btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const data = base64ToBase64url(btoa(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000) })));
  
  const key = await getCryptoKey(secret);
  const signatureBuffer = await globalThis.crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${header}.${data}`)
  );
  
  const signature = base64ToBase64url(
    btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
  );
  
  return `${header}.${data}.${signature}`;
}

/**
 * Verifies a JWT token with a secret using HMAC-SHA256 (Web Crypto compatible, runs in Node and Edge).
 */
export async function verifyToken(token: string, secret: string): Promise<any | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, data, signature] = parts;
    
    const encoder = new TextEncoder();
    const key = await getCryptoKey(secret);
    
    const signatureBytes = new Uint8Array(
      atob(base64urlToBase64(signature))
        .split("")
        .map((c) => c.charCodeAt(0))
    );
    
    const isValid = await globalThis.crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      encoder.encode(`${header}.${data}`)
    );
    
    if (!isValid) return null;
    
    const decodedData = atob(base64urlToBase64(data));
    return JSON.parse(decodedData);
  } catch (e) {
    console.error("JWT verification error:", e);
    return null;
  }
}
