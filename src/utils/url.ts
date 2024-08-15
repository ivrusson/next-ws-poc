export function getOrigin() {
  const origin = window.location.origin;
  return origin;
}

export function formatUrl(path: string) {
  const origin = getOrigin();
  return `${origin}${path}`;
}

export function formatWebSocketUrl(path: string) {
  const origin = getOrigin();
  return `${origin.replace("http", "ws")}${path}`;
}
