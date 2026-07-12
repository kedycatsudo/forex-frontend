const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is not set. Define it in .env.local (see .env.local.example)."
  );
}

export async function getBackendLiveHealth(): Promise<unknown> {
  const res = await fetch(`${apiBaseUrl}/health/live`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status}`);
  }

  return res.json();
}