export enum ContentActions {
  INFO = "info",
  EDIT_METADATA = "editMetadata",
  MOVE_TO_FOLDER = "moveToFolder",
  DOWNLOAD = "download",
  SHARE = "share",
  DELETE = "delete",
}

export enum OrgMemberActions {
  EDIT = "edit",
  DELETE = "delete",
  TRANSFER_OWNERSHIP = "transferOwnership",
  CANCEL_INVITATION = "cancelInvitation"
}

export type ResponseResult = {
  message: string;
  status?: "error" | "success";
};
