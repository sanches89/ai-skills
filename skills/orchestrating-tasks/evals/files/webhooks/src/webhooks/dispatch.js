import { sendWebhook } from "./send.js";

export async function dispatchEvent(event, { urls, fetchFn = fetch }) {
  return Promise.all(urls.map((url) => sendWebhook(url, event, fetchFn)));
}
