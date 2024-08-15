import Cookies from "js-cookie";

export function getClientIdFromCookie(): string | null {
  const clientId = Cookies.get("client_id");
  console.log("getClientIdFromCookie", clientId);
  return clientId ?? null;
}
