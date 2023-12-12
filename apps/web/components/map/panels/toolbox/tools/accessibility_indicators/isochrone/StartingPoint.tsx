// import React, { useEffect, useState, useMemo } from "react";
// import {
//   Box,
//   Typography,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   debounce,
//   useTheme,
//   TextField,
//   Button,
//   Autocomplete,
// } from "@mui/material";
// import { useTranslation } from "@/i18n/client";
// import { v4 } from "uuid";
// import { useProjectLayers } from "@/lib/api/projects";
// import { useMap } from "react-map-gl";
// import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
// import search from "@/lib/services/geocoder";
// import { testForCoordinates } from "@/components/map/controls/Geocoder";
// import { MAPBOX_TOKEN } from "@/lib/constants";
// import { useParams } from "next/navigation";
// import { useDispatch } from "react-redux";
// import { addMarker, removeMarker } from "@/lib/store/map/slice";

import type { StartingPointType } from "@/types/map/isochrone";
// import type { Result } from "@/types/map/controllers";
// import type { FeatureCollection } from "geojson";
import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { PostIsochrone } from "@/lib/validations/isochrone";
// import type { SelectChangeEvent } from "@mui/material";

interface PickLayerProps {
  register: UseFormRegister<PostIsochrone>;
  // getValues: UseFormGetValues<PostIsochrone>;
  setValue: UseFormSetValue<PostIsochrone>;
  watch: PostIsochrone;
  startingType: StartingPointType | undefined;
  setStartingType: (value: StartingPointType) => void;
}

// const StartingPoint = (props: PickLayerProps) => {
//   const {
//     register,
//     // getValues,
//     setValue: setFormValue,
//     startingType,
//     watch,
//     setStartingType,
//   } = props;
//   // const { projectLayers } = useProjectLayers();
//   const { projectId } = useParams();
//   const { layers: projectLayers } = useProjectLayers(
//     typeof projectId === "string" ? projectId : "",
//   );
//   const [getCoordinates, setGetCoordinates] = useState<boolean>(false);
//   const [value, setValue] = useState<Result | null>(null);
//   const [options, setOptions] = useState<readonly Result[]>([]);
//   const [inputValue, setInputValue] = useState("");

//   const dispatch = useDispatch();
//   const theme = useTheme();
//   const { map } = useMap();
//   const { t } = useTranslation("maps");

//   const fetch = useMemo(
//     () =>
//       debounce(
//         (
//           request: { value: string; bbox: number[] },
//           onresult: (_error: Error, fc: FeatureCollection) => void,
//         ) => {
//           search(
//             "https://api.mapbox.com",
//             "mapbox.places",
//             MAPBOX_TOKEN,
//             request.value,
//             onresult,
//             undefined,
//             undefined,
//             request.bbox,
//           );
//         },
//         400,
//       ),
//     [],
//   );

//   useEffect(() => {
//     const handleMapClick = (event) => {
//       if (getCoordinates) {
//         dispatch(
//           addMarker({
//             id: `isochrone-${watch.starting_points.latitude.length}`,
//             lat: event.lngLat.lat,
//             long: event.lngLat.lng,
//             iconName: ICON_NAME.LOCATION,
//           }),
//         );
//         watch.starting_points.latitude.push(event.lngLat.lat);
//         watch.starting_points.longitude.push(event.lngLat.lat);
//         setFormValue("starting_points", {
//           latitude: watch.starting_points.latitude,
//           longitude: watch.starting_points.longitude,
//         });
//       }
//     };

//     map.on("click", handleMapClick);

//     return () => {
//       map.off("click", handleMapClick);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [getCoordinates, watch.routing_type]);

//   useEffect(() => {
//     let active = true;
//     if (inputValue === "") {
//       setOptions(value ? [value] : []);
//       return undefined;
//     }
//     const resultCoordinates = testForCoordinates(inputValue);
//     if (resultCoordinates[0]) {
//       const [_, latitude, longitude] = resultCoordinates;

//       setFormValue("starting_points", {latitude: [latitude], longitude: [longitude]})

//       setOptions([
//         {
//           feature: {
//             id: "",
//             type: "Feature",
//             place_type: ["coordinate"],
//             relevance: 1,
//             properties: {
//               accuracy: "point",
//             },
//             text: "",
//             place_name: "",
//             center: [longitude, latitude],
//             geometry: {
//               type: "Point",
//               coordinates: [longitude, latitude],
//               interpolated: false,
//             },
//             address: "",
//             context: [],
//           },
//           label: `${latitude}, ${longitude}`,
//         },
//       ]);
//       return undefined;
//     }

//     const bbox = [
//       map.getBounds().getSouthWest().toArray()[0],
//       map.getBounds().getSouthWest().toArray()[1],
//       map.getBounds().getNorthEast().toArray()[0],
//       map.getBounds().getNorthEast().toArray()[1],
//     ];

//     fetch(
//       { value: inputValue, bbox: bbox },
//       (error: Error, fc: FeatureCollection) => {
//         if (active) {
//           if (!error && fc && fc.features) {
//             setOptions(
//               fc.features
//                 .map((feature) => ({
//                   feature: feature,
//                   label: feature.place_name,
//                 }))
//                 .filter((feature) => feature.label),
//             );
//           }
//         }
//       },
//     );

//     return () => {
//       active = false;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [value, inputValue, fetch]);

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         gap: theme.spacing(2),
//         marginBottom: theme.spacing(4),
//       }}
//     >
//       <Typography variant="body1" sx={{ color: "black" }}>
//         {t("panels.isochrone.starting.starting")}
//       </Typography>
//       <Typography
//         variant="body2"
//         sx={{ fontStyle: "italic", marginBottom: theme.spacing(2) }}
//       >
//         {t("panels.isochrone.starting.starting_point_desc")}
//       </Typography>
//       <Box>
//         <FormControl
//           size="small"
//           fullWidth
//           sx={{
//             margin: `${theme.spacing(1)} 0`,
//           }}
//         >
//           <InputLabel id="demo-simple-select-label">
//             {t("panels.isochrone.starting.type")}
//           </InputLabel>
//           <Select
//             label={t("panels.isochrone.starting.type")}
//             onChange={(event: SelectChangeEvent) => {
//               setStartingType(event.target.value as StartingPointType);
//               setFormValue(
//                 "starting_points",
//                 ["place_on_map", "address_input"].includes(
//                   event.target.value as StartingPointType,
//                 )
//                   ? { latitude: [], longitude: [] }
//                   : { layer_id: "" },
//               );
//               dispatch(removeMarker());
//             }}
//           >
//             <MenuItem value="place_on_map">
//               {t("panels.isochrone.starting.pick_on_map")}
//             </MenuItem>
//             <MenuItem value="browse_layers">
//               {t("panels.isochrone.starting.pick_layer")}
//             </MenuItem>
//             <MenuItem value="address_input">
//               {t("panels.isochrone.starting.search_address")}
//             </MenuItem>
//           </Select>
//         </FormControl>
//       </Box>
//       {/* Pick layer in browse_layer */}
//       {startingType === "browse_layers" ? (
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             gap: theme.spacing(2),
//             marginBottom: theme.spacing(4),
//           }}
//         >
//           <Typography variant="body1" sx={{ color: "black" }}>
//             {t("panels.isochrone.starting.pick_layer")}
//           </Typography>
//           <Box>
//             <FormControl
//               size="small"
//               fullWidth
//               sx={{
//                 margin: `${theme.spacing(1)} 0`,
//               }}
//             >
//               <InputLabel id="demo-simple-select-label">
//                 {t("panels.isochrone.starting.layer")}
//               </InputLabel>
//               <Select
//                 label={t("panels.isochrone.starting.layer")}
//                 {...register("starting_points.layer_id")}
//               >
//                 {projectLayers
//                   ? projectLayers.map((layer) =>
//                       layer.feature_layer_geometry_type === "point" ? (
//                         <MenuItem value={layer.layer_id} key={v4()}>
//                           {layer.name}
//                         </MenuItem>
//                       ) : null,
//                     )
//                   : null}
//               </Select>
//             </FormControl>
//           </Box>
//         </Box>
//       ) : null}
//       {/* select point on map in place_on_map */}
//       {startingType === "place_on_map" ? (
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             gap: theme.spacing(2),
//             marginBottom: theme.spacing(4),
//           }}
//         >
//           <Typography variant="body1" sx={{ color: "black" }}>
//             {t("panels.isochrone.starting.pick_on_map")}
//           </Typography>
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               gap: theme.spacing(2),
//             }}
//           >
//             <TextField
//               value={
//                 watch.starting_points.latitude.length
//                   ? watch.starting_points.latitude
//                       .map(
//                         (el, index) =>
//                           `${el},${watch.starting_points.longitude[index]}`,
//                       )
//                       .join(";")
//                   : ""
//               }
//               size="small"
//               onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
//                 const inputCoords = event.target.value;
//                 const [latitudes, longitudes] = inputCoords
//                   .split(";")
//                   .map((pair) => pair.split(","))
//                   .reduce(
//                     ([latAcc, lonAcc], [latitude, longitude]) => [
//                       [...latAcc, parseFloat(latitude)],
//                       [...lonAcc, parseFloat(longitude)],
//                     ],
//                     [[], []],
//                   );
//                 setFormValue("starting_points", {
//                   latitude: latitudes,
//                   longitude: longitudes,
//                 });
//               }}
//               sx={{
//                 margin: `${theme.spacing(1)} 0`,
//                 width: "70%",
//               }}
//             />
//             <Button
//               variant={getCoordinates ? "contained" : "outlined"}
//               size="large"
//               onClick={() => {
//                 setGetCoordinates(!getCoordinates);
//               }}
//             >
//               <Icon iconName={ICON_NAME.LOCATION} />
//             </Button>
//           </Box>
//         </Box>
//       ) : null}
//       {/* Pick layer in address_search */}
//       {startingType === "address_input" ? (
//         <Box>
//           <Typography variant="body1" sx={{ color: "black" }}>
//             {t("panels.isochrone.starting.search_location")}
//           </Typography>
//           <Autocomplete
//             disablePortal
//             id="geocoder"
//             size="small"
//             filterOptions={(x) => x}
//             options={options}
//             fullWidth
//             sx={{
//               margin: `${theme.spacing(1)} 0`,
//             }}
//             onChange={(_event: unknown, newValue: Result | null) => {
//               setOptions(newValue ? [newValue, ...options] : options);
//               setValue(newValue);
//             }}
//             onInputChange={(_event, newInputValue) => {
//               setInputValue(newInputValue);
//             }}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label={t("panels.isochrone.starting.search_address")}

//                 // value={inputValue ? { label: inputValue } : { label: "" }}
//               />
//             )}
//           />
//         </Box>
//       ) : null}
//     </Box>
//   );
// };

// export default StartingPoint;

const StartingPoint = (_props: PickLayerProps) => {
  return <></>;
};
export default StartingPoint;
