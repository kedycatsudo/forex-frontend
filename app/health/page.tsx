import { getBackendLiveHealth } from "@/services/api";

export default async function HealthPage() {
  let data: unknown = null;
  let error: string | null = null;

  try {
    data = await getBackendLiveHealth();
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>System Health</h1>
      {error ? (
        <p style={{ color: "crimson" }}>Backend unreachable: {error}</p>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </main>
  );
}