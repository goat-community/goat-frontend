import { useTranslation } from "@/i18n/client";
import { useLayerClassBreaks } from "@/lib/api/layers";
import type { ColorScaleSelectorProps } from "@/types/map/color";

const OrdinalColorScale = (props: ColorScaleSelectorProps) => {
  const { selectedColorScaleMethod, activeLayerId, activeLayerField, intervals } =
    props;
  const { t } = useTranslation("maps");
  // const { classBreaks: classBreaksValues } = useLayerClassBreaks(
  //   activeLayerId,
  //   selectedColorScaleMethod,
  //   activeLayerField.name,
  //   intervals,
  // );

  // console.log(classBreaksValues);

  return <>Ordinal Color Scale</>;
};

export default OrdinalColorScale;
