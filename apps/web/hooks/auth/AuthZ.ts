import { useMemo } from "react";

import { useUserProfile } from "@/lib/api/users";
import { organizationRoles } from "@/lib/validations/organization";
import { teamRoles, type Team } from "@/lib/validations/team";

interface Options {
  team?: Team;
}

export function useAuthZ(options: Options = {}) {
  const { userProfile, isLoading: isUserProfileLoading } = useUserProfile();

  const roles = userProfile?.roles;

  const isOrgAdmin = useMemo(() => {
    if (!roles) return false;
    return roles.includes(organizationRoles.OWNER) || roles.includes(organizationRoles.ADMIN);
  }, [roles]);

  const isOrgEditor = useMemo(() => {
    if (!roles) return false;
    return roles.includes(organizationRoles.EDITOR) || isOrgAdmin;
  }, [roles, isOrgAdmin]);

  const isTeamOwner = useMemo(() => {
    const { team } = options;
    if (!team || !roles) return false;
    return team.role === teamRoles.OWNER
  }, [roles, options]);

  const isProjectEditor = useMemo(() => {
    return isOrgEditor;
  }, [isOrgEditor]);

  const isLoading = useMemo(() => {
    return isUserProfileLoading;
  }, [isUserProfileLoading]);

  return {
    isLoading,
    isOrgAdmin,
    isOrgEditor,
    isTeamOwner,
    isProjectEditor,
  };
}
