import { useEffect, useState } from "react";
import { getProjectLayers } from "@/lib/api/projects";
import { useDispatch } from "react-redux";
import { setLayers } from "@/lib/store/layer/slice";
import { useParams } from "next/navigation";
import type { Layer } from "@/lib/validations/layer";

export const useProjectLayers = () => {
  const [projectLayers, setProjectlayers] = useState<Layer[]>([]);

  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    getProjectLayers(typeof params.projectId === "string" ? params.projectId : "").then((data) => {
      const layers = data.map((layer) => ({ ...layer, active: false }));
      setProjectlayers(layers);
      dispatch(setLayers(layers));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {projectLayers};
};
