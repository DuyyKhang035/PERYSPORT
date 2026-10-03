const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';

export async function fetchBackend(path) {
  const response = await fetch(`${backendUrl}${path}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status}`);
  }

  return response.json();
}
