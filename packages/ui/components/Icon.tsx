import { library } from "@fortawesome/fontawesome-svg-core";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faLayerGroup,
  faList,
  faChartSimple,
  faFileInvoice,
  faQuestionCircle,
  faToolbox,
  faFilter,
  faCompassDrafting,
  faPalette,
  faSignOut,
  faBuilding,
  faMap,
  faClose,
  faHouse,
  faFolder,
  faGears,
  faCircleCheck,
  faCircleExclamation,
  faEnvelope,
  faRocket,
  faPersonRunning,
  faBus,
  faPlus,
  faMinus,
  faMaximize,
  faMinimize,
  faStar,
  faEllipsis,
  faSearch,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faEye,
  faEyeSlash,
  faEllipsisVertical,
  faCaretUp,
  faCaretDown,
  faLocationDot,
  faCross,
  faCircle,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import {
  faGoogle,
  faFacebook,
  faMicrosoft,
  faInstagram,
  faXTwitter,
  faLinkedin,
  faStackOverflow,
  faGithub,
  faGitlab,
  faBitbucket,
  faPaypal,
} from "@fortawesome/free-brands-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SvgIcon } from "@mui/material";
import type { SvgIconProps } from "@mui/material";

export enum ICON_NAME {
  // Solid icons
  LAYERS = "layers",
  LEGEND = "legend",
  CHART = "chart",
  REPORT = "report",
  HELP = "help",
  TOOLBOX = "toolbox",
  FILTER = "filter",
  SCENARIO = "scenario",
  STYLE = "style",
  SIGNOUT = "signout",
  ORGANIZATION = "organization",
  MAP = "map",
  CLOSE = "close",
  HOUSE = "house",
  FOLDER = "folder",
  SETTINGS = "settings",
  CIRCLECHECK = "circleCheck",
  CIRCLEINFO = "circleInfo",
  EMAIL = "email",
  ROCKET = "rocket",
  RUN = "run",
  BUS = "bus",
  PLUS = "plus",
  MINUS = "minus",
  MAXIMIZE = "maximize",
  MINIMIZE = "minimize",
  STAR = "star",
  ELLIPSIS = "ellipsis",
  SEARCH = "search",
  CHEVRON_LEFT = "chevron-left",
  CHEVRON_RIGHT = "chevron-right",
  CHEVRON_DOWN = "chevron-down",
  EYE = "eye",
  EYE_SLASH = "eye-slash",
  MORE_VERT = "more-vert",
  STEPUP = "step-up",
  STEPDOWN = "step-down",
  LOCATION = "location",
  CROSS = "cross",
  CIRCLE = "circle",
  USERS = "users",
  // Brand icons
  GOOGLE = "google",
  MICROSOFT = "microsoft",
  FACEBOOK = "facebook",
  GITHUB = "github",
  GITLAB = "gitlab",
  STACKOVERFLOW = "stackoverflow",
  TWITTER = "twitter",
  LINKEDIN = "linkedin",
  INSTAGRAM = "instagram",
  BITBUCKET = "bitbucket",
  PAYPAL = "paypal",
}

const nameToIcon: { [k in ICON_NAME]: IconDefinition } = {
  // Solid icons
  [ICON_NAME.LAYERS]: faLayerGroup,
  [ICON_NAME.LEGEND]: faList,
  [ICON_NAME.CHART]: faChartSimple,
  [ICON_NAME.REPORT]: faFileInvoice,
  [ICON_NAME.HELP]: faQuestionCircle,
  [ICON_NAME.TOOLBOX]: faToolbox,
  [ICON_NAME.FILTER]: faFilter,
  [ICON_NAME.SCENARIO]: faCompassDrafting,
  [ICON_NAME.STYLE]: faPalette,
  [ICON_NAME.SIGNOUT]: faSignOut,
  [ICON_NAME.ORGANIZATION]: faBuilding,
  [ICON_NAME.MAP]: faMap,
  [ICON_NAME.CLOSE]: faClose,
  [ICON_NAME.HOUSE]: faHouse,
  [ICON_NAME.FOLDER]: faFolder,
  [ICON_NAME.SETTINGS]: faGears,
  [ICON_NAME.CIRCLECHECK]: faCircleCheck,
  [ICON_NAME.CIRCLEINFO]: faCircleExclamation,
  [ICON_NAME.EMAIL]: faEnvelope,
  [ICON_NAME.ROCKET]: faRocket,
  [ICON_NAME.RUN]: faPersonRunning,
  [ICON_NAME.BUS]: faBus,
  [ICON_NAME.PLUS]: faPlus,
  [ICON_NAME.MINUS]: faMinus,
  [ICON_NAME.MAXIMIZE]: faMaximize,
  [ICON_NAME.MINIMIZE]: faMinimize,
  [ICON_NAME.ELLIPSIS]: faEllipsis,
  [ICON_NAME.SEARCH]: faSearch,
  [ICON_NAME.CHEVRON_LEFT]: faChevronLeft,
  [ICON_NAME.CHEVRON_RIGHT]: faChevronRight,
  [ICON_NAME.CHEVRON_DOWN]: faChevronDown,
  [ICON_NAME.EYE]: faEye,
  [ICON_NAME.EYE_SLASH]: faEyeSlash,
  [ICON_NAME.STAR]: faStar,
  [ICON_NAME.MORE_VERT]: faEllipsisVertical,
  [ICON_NAME.STEPUP]: faCaretUp,
  [ICON_NAME.STEPDOWN]: faCaretDown,
  [ICON_NAME.LOCATION]: faLocationDot,
  [ICON_NAME.CROSS]: faCross,
  [ICON_NAME.CIRCLE]: faCircle,
  [ICON_NAME.USERS]: faUsers,
  // Brand icons
  [ICON_NAME.GOOGLE]: faGoogle,
  [ICON_NAME.MICROSOFT]: faMicrosoft,
  [ICON_NAME.FACEBOOK]: faFacebook,
  [ICON_NAME.GITHUB]: faGithub,
  [ICON_NAME.GITLAB]: faGitlab,
  [ICON_NAME.STACKOVERFLOW]: faStackOverflow,
  [ICON_NAME.TWITTER]: faXTwitter,
  [ICON_NAME.LINKEDIN]: faLinkedin,
  [ICON_NAME.INSTAGRAM]: faInstagram,
  [ICON_NAME.BITBUCKET]: faBitbucket,
  [ICON_NAME.PAYPAL]: faPaypal,
};

interface BrandColors {
  [key: string]: string;
}
export const brandColors: BrandColors = {
  [ICON_NAME.GOOGLE]: "#4285F4",
  [ICON_NAME.MICROSOFT]: "#00A4EE",
  [ICON_NAME.FACEBOOK]: "#3B5998",
  [ICON_NAME.GITHUB]: "#333333",
  [ICON_NAME.GITLAB]: "#FCA121",
  [ICON_NAME.STACKOVERFLOW]: "#FE7A15",
  [ICON_NAME.TWITTER]: "#1DA1F2",
  [ICON_NAME.LINKEDIN]: "#0077B5",
  [ICON_NAME.INSTAGRAM]: "#E1306C",
  [ICON_NAME.BITBUCKET]: "#0052CC",
  [ICON_NAME.PAYPAL]: "#0079C1",
};

library.add(...Object.values(nameToIcon));

export function Icon({
  iconName,
  ...rest
}: SvgIconProps & { iconName: ICON_NAME }) {
  if (!(iconName in nameToIcon)) {
    throw new Error(`Invalid icon name: ${iconName}`);
  }
  return (
    <SvgIcon {...rest}>
      <FontAwesomeIcon icon={nameToIcon[iconName]} />
    </SvgIcon>
  );
}
