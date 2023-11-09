import DeleteOrgMemberModal from "@/components/modals/settings/DeleteOrgMember";
import { OrgMemberActions } from "@/types/common";
import type { OrgMemberDialogBaseProps } from "@/types/dashboard/settings";

interface OrgMemberDialogProps extends Omit<OrgMemberDialogBaseProps, "open"> {
  action: OrgMemberActions;
  onMemberDelete?: () => void;
}

export default function OrgMemberDialogWrapper(props: OrgMemberDialogProps) {
  const commonModalProps = {
    member: props.member,
    open: !!props.member,
    onClose: props.onClose
  };

  return (
    <>
      {props.action === OrgMemberActions.DELETE && (
        <DeleteOrgMemberModal
          onDelete={props.onMemberDelete}
          {...commonModalProps}
        />
      )}
    </>
  );
}
