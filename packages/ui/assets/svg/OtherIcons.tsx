import type {
  IconDefinition,
  IconName,
  IconPrefix,
} from "@fortawesome/fontawesome-svg-core";

export const addImageIcon: IconDefinition = {
  icon: [
    // SVG viewbox width (in pixels)
    24,
    // SVG viewbox height (in pixels)
    24,
    // Aliases (not needed)
    [],
    // Unicode as hex value (not needed)
    "",
    // SVG path data
    "M23,4v2h-3v3h-2V6h-3V4h3V1h2v3H23z M14.5,11c0.828,0,1.5-0.672,1.5-1.5S15.328,8,14.5,8S13,8.672,13,9.5    S13.672,11,14.5,11z M18,14.234l-0.513-0.57c-0.794-0.885-2.181-0.885-2.976,0l-0.656,0.731L9,9l-3,3.333V6h7V4H6    C4.895,4,4,4.895,4,6v12c0,1.105,0.895,2,2,2h12c1.105,0,2-0.895,2-2v-7h-2V14.234z",
  ],
  iconName: "add-image" as IconName,
  prefix: "fas" as IconPrefix,
};

export const comingSoonIcon: IconDefinition = {
  icon: [
    24,
    24,
    [],
    "",
    "M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8    S16.41,20,12,20z M12,6c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S13.1,6,12,6z",
  ],
  iconName: "coming-soon" as IconName,
  prefix: "fas" as IconPrefix,
};