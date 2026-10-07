export async function sendWebhook(url, body, fetchFn = fetch) {
  try {
    const res = await fetchFn(url, { method: "POST", body: JSON.stringify(body) });
    return { status: res.status };
  } catch {
    return { status: null };
  }
}
