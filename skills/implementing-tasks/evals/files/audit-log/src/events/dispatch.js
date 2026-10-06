const handlers = [];
export function subscribe(fn) { handlers.push(fn); }
export function publish(event) { for (const h of handlers) h(event); }
