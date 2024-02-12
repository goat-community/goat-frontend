import { useTranslation } from "@/i18n/client";
import type {
  FeatureLayerProperties,
  LayerFieldType,
} from "@/lib/validations/layer";
import LayerFieldSelector from "@/components/map/panels/style/classification/LayerFieldSelector";
import MarkerIconPicker from "@/components/map/panels/style/marker/MarkerIconPicker";
import MarkerSelector from "@/components/map/panels/style/classification/MarkerSelector";
import SectionOptions from "@/components/map/panels/common/SectionOptions";

const MarkerOptions = ({
  type,
  layerStyle,
  active,
  layerId,
  layerFields,
  selectedField,
  collapsed,
  onStyleChange,
}: {
  type: "marker";
  layerStyle?: FeatureLayerProperties;
  active: boolean;
  selectedField?: LayerFieldType;
  layerId: string;
  layerFields: LayerFieldType[];
  collapsed?: boolean;
  onStyleChange?: (newStyle: FeatureLayerProperties) => void;
}) => {
  const { t } = useTranslation(["maps", "common"]);

  return (
    <SectionOptions
      active={!!active}
      baseOptions={
        <MarkerIconPicker
          selectedMarker={{
            name: layerStyle?.[`${type}`]?.["name"] || t("maps:select_marker"),
            url: layerStyle?.[`${type}`]?.["url"] || "",
          }}
          label={t("maps:single_marker")}
          onSelectMarker={(marker) => {
            const newStyle = JSON.parse(JSON.stringify(layerStyle)) || {};
            newStyle[`${type}`] = {
              name: marker.name,
              url: marker.url,
            };
            if (onStyleChange) {
              onStyleChange(newStyle);
            }
          }}
        />
      }
      advancedOptions={
        <>
          <LayerFieldSelector
            fields={layerFields.filter((f) => f.type === "string")}
            selectedField={selectedField}
            setSelectedField={(field) => {
              const newStyle = JSON.parse(JSON.stringify(layerStyle)) || {};
              newStyle[`${type}_field`] = field;
              if (onStyleChange) {
                onStyleChange(newStyle);
              }
            }}
            label={t("maps:marker_based_on")}
            tooltip={t("maps:marker_based_on_desc")}
          />

          {layerStyle?.[`custom_${type}`] && layerStyle?.[`${type}_field`] && (
            <MarkerSelector
              markerMaps={layerStyle?.[`${type}_mapping`] || []}
              onCustomOrdinalApply={(markerMaps) => {
                const newStyle = JSON.parse(JSON.stringify(layerStyle)) || {};
                newStyle[`${type}_mapping`] = markerMaps;
                if (onStyleChange) {
                  onStyleChange(newStyle);
                }
              }}
              label={t("maps:ordinal_marker")}
              activeLayerId={layerId}
              activeLayerField={
                layerStyle[`${type}_field`] || { name: "", type: "string" }
              }
            />
          )}
        </>
      }
      collapsed={collapsed}
    />
  );
};

export default MarkerOptions;
