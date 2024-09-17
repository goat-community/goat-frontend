import { KEYCLOAK_CLIENT_ID, KEYCLOAK_ISSUER } from "@/lib/constants";
import { organizationRoles } from "@/lib/validations/organization";
import { teamRoles } from "@/lib/validations/team";

export function isOrgAdmin(roles?: string[]) {
  if (!roles) return false;
  return roles.includes(organizationRoles.OWNER) || roles.includes(organizationRoles.ADMIN);
}

export function isOrgEditor(roles?: string[]) {
  if (!roles) return false;
  return roles.includes(organizationRoles.EDITOR) || isOrgAdmin(roles);
}

export function isTeamOwner(role: string) {
  return role === teamRoles.OWNER;
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
