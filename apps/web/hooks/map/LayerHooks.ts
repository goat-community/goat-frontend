import { useGetLayerKeys } from "@/lib/api/filter";

export const useLayerHook = (layerId: string) => {

  const { data, isLoading } = useGetLayerKeys(layerId);

  const getLayerKeys = () => {
    console.log(data)
    if(layerId){
      return {
        keys: isLoading
          ? []
          : Object.keys(data.properties)
              .filter((key) => "name" in data.properties[key])
              .map((key) => ({
                name: data.properties[key].name,
                type: data.properties[key].type,
              }))
            }
    }else {
      return {
        keys: []
      }
    }
  };

  return { getLayerKeys };
};
