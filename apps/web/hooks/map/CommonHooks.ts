import { useLayerQueryables } from "@/lib/api/layers";
import { useMemo } from "react";

const useLayerFields = (
  dataset_id: string,
  filterType?: "string" | "number" | undefined,
  hiddenFields: string[] = [],
) => {
  const { queryables, isLoading, isError } = useLayerQueryables(
    dataset_id || "",
  );

  const layerFields = useMemo(() => {
    if (!queryables || !dataset_id) return [];
    return Object.entries(queryables.properties)
      .filter(([key, value]) => {
        if (hiddenFields.includes(key)) {
          return false;
        }
        if (filterType) {
          return value.type === filterType;
        } else {
          return value.type === "string" || value.type === "number";
        }
      })
      .map(([key, value]) => {
        return {
          name: key,
          type: value.type,
        };
      });
  }, [dataset_id, filterType, queryables, hiddenFields]);

  return {
    layerFields,
    isLoading,
    isError,
  };
};

export default useLayerFields;
