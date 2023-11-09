import type { PopperMenuItem } from "@/components/common/PopperMenu";
import { useTranslation } from "@/i18n/client";
import type { OrganizationMember } from "@/lib/validations/organization";
import { OrgMemberActions } from "@/types/common";
import { ICON_NAME } from "@p4b/ui/components/Icon";
import { useState } from "react";

export const useOrgMemberSettingsMoreMenu = () => {
  const { t } = useTranslation(["dashboard", "common"]);
  const activeMemberMoreMenuOptions: PopperMenuItem[] = [
    {
      id: OrgMemberActions.EDIT,
      label: t("common:edit"),
      icon: ICON_NAME.EDIT,
    },
    {
      id: OrgMemberActions.TRANSFER_OWNERSHIP,
      label: t("dashboard:transfer_ownership"),
      icon: ICON_NAME.CROWN,
    },
    {
      id: OrgMemberActions.DELETE,
      label: t("common:remove"),
      icon: ICON_NAME.TRASH,
      color: "error.main",
    },
  ];

  const pendingInvitationMoreMenuOptions: PopperMenuItem[] = [
    {
      id: OrgMemberActions.CANCEL_INVITATION,
      label: t("dashboard:cancel_invitation"),
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

  const openMoreMenu = (
    menuItem: PopperMenuItem,
    memberItem: OrganizationMember,
  ) => {
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
