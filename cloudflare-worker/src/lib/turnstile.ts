interface TurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
}

export async function verifyTurnstile(
  env: { TURNSTILE_SECRET: string },
  token: string | null,
  ip?: string | null
): Promise<{ ok: boolean; errors?: string[] }> {
  if (!token) {
    return { ok: false, errors: ["missing-token"] };
  }

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: token,
        remoteip: ip || "",
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });
    const data = (await res.json()) as TurnstileResponse;
    if (!data.success) {
      return { ok: false, errors: data["error-codes"] || ["turnstile-failed"] };
    }
    return { ok: true };
  } catch (err) {
    console.error("Turnstile verification error", err);
    return { ok: false, errors: ["turnstile-error"] };
  }
}
