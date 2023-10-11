import MetadataModal from "@/components/modals/Metadata";
import DeleteContentModal from "@/components/modals/DeleteContent";
import type { ContentDialogBaseProps } from "@/types/dashboard/content";
import { ContentActions } from "@/types/common";

interface ContentDialogProps extends Omit<ContentDialogBaseProps, "open"> {
  action: ContentActions;
  onContentDelete?: () => void;
}

export default function ContentDialogWrapper(props: ContentDialogProps) {
  const commonModalProps = {
    content: props.content,
    open: !!props.content,
    onClose: props.onClose,
    type: props.type,
  };

  return (
    <>
      {props.action === ContentActions.EDIT_METADATA && (
        <MetadataModal {...commonModalProps} />
      )}
      {props.action === ContentActions.DELETE && (
        <DeleteContentModal
          onDelete={props.onContentDelete}
          {...commonModalProps}
        />
      )}
    </>
  );
}
