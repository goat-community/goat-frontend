import { useLayerKeys } from "@/lib/api/layers";
export const useGetLayerKeys = (layerId: string) => {
  const { isLoading, error, data } = useLayerKeys(layerId);
  return {
    keys:
      isLoading || error || !data
        ? []
        : Object.keys(data.properties)
            .filter((key) => "name" in data.properties[key])
            .map((key) => ({
              name: data.properties[key].name,
              type: data.properties[key].type,
            })),
  };
};
