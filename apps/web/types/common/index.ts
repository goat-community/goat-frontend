export type NestedPartial<T> = {
  [P in keyof T]?: NestedPartial<T[P]>;
};

export enum ContentActions {
  INFO = "info",
  EDIT_METADATA = "editMetadata",
  MOVE_TO_FOLDER = "moveToFolder",
  DOWNLOAD = "download",
  SHARE = "share",
  DELETE = "delete",
}

export enum MapLayerActions {
  DUPLICATE = "duplicate",
  RENAME = "rename",
  ZOOM_TO = "zoomTo",
  PROPERTIES = "properties",
}

export enum OrgMemberActions {
  EDIT = "edit",
  DELETE = "delete",
  TRANSFER_OWNERSHIP = "transferOwnership",
  CANCEL_INVITATION = "cancelInvitation",
}

export type ResponseResult = {
  message: string;
  status?: "error" | "success";
};
