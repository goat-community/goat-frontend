export function isAdmin(roles?: string[]) {
  // todo: user enums
  if (!roles) return false;
  return roles.includes("admin") || roles.includes("owner");
}
