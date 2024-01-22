import { useTranslation } from "@/i18n/client";
import type { LayerFieldType } from "@/lib/validations/layer";
import OptionsCollapse from "@/components/map/panels/style/other/OptionsCollapse";
import LayerFieldSelector from "@/components/map/panels/style/classification/LayerFieldSelector";

const LabelOptions = ({
  // layerStyle,
  // layerId,
  active,
  layerFields,
  selectedField,
  collapsed,
} // onStyleChange,
: {
  // layerStyle?: FeatureLayerProperties;
  // layerId: string;
  active: boolean;
  selectedField?: LayerFieldType;
  layerFields: LayerFieldType[];
  collapsed?: boolean;
  // onStyleChange?: (newStyle: FeatureLayerProperties) => void;
}) => {
  const { t } = useTranslation(["maps", "common"]);

  return (
    <OptionsCollapse
      active={!!active}
      baseOptions={
        <LayerFieldSelector
          fields={layerFields}
          selectedField={selectedField}
          setSelectedField={(field) => {
            console.log(field);
          }}
          label={t("maps:color_based_on")}
          tooltip={t("maps:color_based_on_desc")}
        />
      }
      advancedOptions={<></>}
      collapsed={collapsed}
    />
  );
};

export default LabelOptions;
