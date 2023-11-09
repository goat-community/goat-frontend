import type { DialogBaseProps } from "@/types/common/dialog";
import type { OrganizationMember } from "@/lib/validations/organization";

export interface OrgMemberDialogBaseProps extends DialogBaseProps {
  open: boolean;
  onClose?: () => void;
  member: OrganizationMember;
}
