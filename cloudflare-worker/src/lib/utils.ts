export function makeRef(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const base36 = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    .toString(36)
    .slice(0, 6)
    .toUpperCase();
  return `D3D-${yyyy}-${mm}${dd}-${base36}`;
}

export function normalizeName(name: string | null | undefined): string {
  return (name || "").trim();
}

export function json(res: unknown, status = 200): Response {
  return new Response(JSON.stringify(res), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
}
