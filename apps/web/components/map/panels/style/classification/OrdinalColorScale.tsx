import { useUniqueValues } from "@/lib/api/layers";
import type { ColorScaleSelectorProps } from "@/types/map/color";

const OrdinalColorScale = (props: ColorScaleSelectorProps) => {
  const { activeLayerId, activeLayerField } = props;
  const { data } = useUniqueValues(activeLayerId, activeLayerField.name);

  console.log(data);

  return <>Ordinal Color Scale</>;
};

export default OrdinalColorScale;
