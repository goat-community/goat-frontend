import { useLayerKeys } from "@/lib/api/layers";
import { useProjectLayers } from "@/lib/api/projects";
import { useParams } from "next/navigation";

export const useGetLayerKeys = (layerId: string) => {
  const { isLoading, error, data } = useLayerKeys(layerId);

  return {
    keys:
      (isLoading || error || !data)
        ? []
        : Object.keys(data.properties)
            .filter((key) => "name" in data.properties[key])
            .map((key) => ({
              name: data.properties[key].name,
              type: data.properties[key].type,
            })),
  };
};

export const useGetUniqueLayerName = (name: string): { uniqueName: string } => {
  const { projectId } = useParams();

  const { layers } = useProjectLayers(
    typeof projectId === "string" ? projectId : "",
  );

  let uniqueName = name;

  if (!layers?.filter((layer) => layer.name === name).length) {
    return {
      uniqueName: uniqueName,
    };
  } else {
    let copy: string | undefined = "1";

    while (copy !== undefined) {
      if (
        !layers?.filter((layer) => layer.name === `${name} (${copy})`).length
      ) {
        uniqueName = `${name} (${copy})`;

        copy = undefined;
      } else {
        copy = (parseInt(copy) + 1).toString();
      }
    }

    return {
      uniqueName: uniqueName,
    };
  }
};
