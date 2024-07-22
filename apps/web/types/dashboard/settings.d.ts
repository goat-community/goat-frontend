import type { OrganizationMember } from "@/lib/validations/organization";

import type { DialogBaseProps } from "@/types/common/dialog";

export interface OrgMemberDialogBaseProps extends DialogBaseProps {
  open: boolean;
  onClose?: () => void;
  member: OrganizationMember;
}
