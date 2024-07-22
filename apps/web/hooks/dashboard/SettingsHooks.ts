import { useState } from "react";

import { ICON_NAME } from "@p4b/ui/components/Icon";

import { useTranslation } from "@/i18n/client";

import type { OrganizationMember } from "@/lib/validations/organization";

import { OrgMemberActions } from "@/types/common";

import type { PopperMenuItem } from "@/components/common/PopperMenu";

export const useOrgMemberSettingsMoreMenu = () => {
  const { t } = useTranslation("common");
  const activeMemberMoreMenuOptions: PopperMenuItem[] = [
    {
      id: OrgMemberActions.EDIT,
      label: t("edit"),
      icon: ICON_NAME.EDIT,
    },
    {
      id: OrgMemberActions.TRANSFER_OWNERSHIP,
      label: t("transfer_ownership"),
      icon: ICON_NAME.CROWN,
    },
    {
      id: OrgMemberActions.DELETE,
      label: t("remove"),
      icon: ICON_NAME.TRASH,
      color: "error.main",
    },
  ];

  const pendingInvitationMoreMenuOptions: PopperMenuItem[] = [
    {
      id: OrgMemberActions.CANCEL_INVITATION,
      label: t("cancel_invitation"),
      icon: ICON_NAME.TRASH,
      color: "error.main",
    },
  ];

  const [activeMember, setActiveMember] = useState<OrganizationMember>();
  const [moreMenuState, setMoreMenuState] = useState<PopperMenuItem>();

  const closeMoreMenu = () => {
    setActiveMember(undefined);
    setMoreMenuState(undefined);
  };

  const openMoreMenu = (menuItem: PopperMenuItem, memberItem: OrganizationMember) => {
    setActiveMember(memberItem);
    setMoreMenuState(menuItem);
  };

  return {
    activeMemberMoreMenuOptions,
    pendingInvitationMoreMenuOptions,
    activeMember,
    moreMenuState,
    closeMoreMenu,
    openMoreMenu,
  };
};
