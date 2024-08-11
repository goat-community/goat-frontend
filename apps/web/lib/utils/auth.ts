import { KEYCLOAK_CLIENT_ID, KEYCLOAK_ISSUER } from "@/lib/constants";

export function isAdmin(roles?: string[]) {
  // todo: user enums
  if (!roles) return false;
  return roles.includes("admin") || roles.includes("owner");
}



//INFO: Keycloak doesn't support prompt=create in signIn endpoint. This is a hacky workaround to create a registration link manually when user is coming from the invite link.
//TODO: This should be removed once Keycloak supports prompt=create in signIn endpoint.
// https://github.com/nextauthjs/next-auth/discussions/6368
export const createRegistrationUrl = (redirectUri: string) => {
  const registrationEndpoint = `${KEYCLOAK_ISSUER}/protocol/openid-connect/registrations`
  const params = new URLSearchParams()
  params.set('client_id', KEYCLOAK_CLIENT_ID as string)
  params.set('redirect_uri', redirectUri)
  params.set('scope', 'openid email profile offline_access')
  params.set('response_type', 'code')
  params.set('response_mode', 'fragment')
  return `${registrationEndpoint}?${params.toString()}`
}
