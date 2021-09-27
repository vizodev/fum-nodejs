export function getToken(req: any, prefix = "Bearer") {
  const header = req.header("authorization") as string;
  if (!header || !header.startsWith(prefix)) return null;
  const [, token] = header.split(prefix) ?? [];
  return token?.trim() ?? null;
}
