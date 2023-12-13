// "use client";

// import React, { useState, useMemo } from "react";
// import { comparerModes } from "@/public/assets/data/comparers_filter";

// import FilterOptionField from "./FilterOptionField";
// import { ICON_NAME } from "@p4b/ui/components/Icon";
// import { Icon } from "@p4b/ui/components/Icon";
// import { v4 } from "uuid";
// import {
//   Button,
//   MenuList,
//   MenuItem,
//   Box,
//   useTheme,
//   Typography,
//   Select,
//   Chip,
//   FormControl,
//   InputLabel,
// } from "@mui/material";
// import type { Expression } from "@/types/map/filtering";
// // import { useSelector } from "react-redux";
// import { useTranslation } from "@/i18n/client";
// import CustomMenu from "@/components/common/CustomMenu";
// // import { addExpression, removeFilter } from "@/lib/store/mapFilters/slice";
// import type { LayerPropsMode } from "@/types/map/filtering";
// import type { SelectChangeEvent } from "@mui/material";
// // import type { IStore } from "@/types/store";

// interface ExpressionProps {
//   isLast: boolean;
//   expression: Expression;
//   logicalOperator: string;
//   deleteOneExpression: (value: string) => void;
//   duplicateExpression: (value: string) => void;
//   id: string;
//   keys: LayerPropsMode[];
// }

// interface ExpressionAttributesProps {
//   keys: LayerPropsMode[];
//   attributeSelected: string | string[];
//   setAttributeSelected: (value: string | string[]) => void;
//   comparerSelected: string | string[];
//   setComparerSelected: (value: string | string[]) => void;
//   expression: Expression;
//   children: React.ReactNode;
//   deleteOneExpression: (value: string) => void;
//   duplicateExpression: (value: string) => void;
// }

// const ExpressionAttributes = (props: ExpressionAttributesProps) => {
//   const {
//     keys,
//     attributeSelected,
//     setComparerSelected,
//     comparerSelected,
//     expression,
//     setAttributeSelected,
//     children,
//     deleteOneExpression,
//     duplicateExpression,
//   } = props;
//   // const { loading: mapLoading } = useSelector((state: IStore) => state.map);
//   const mapLoading = false;
//   const [anchorEl, setAnchorEl] = React.useState<boolean>(false);

//   const theme = useTheme();
//   const { t } = useTranslation("maps");
//   const open = Boolean(anchorEl);

//   function getFeatureAttribute(type: string | string[]) {
//     const valueToFilter = keys.filter((key) => key.name === type);
//     if (valueToFilter.length && valueToFilter[0].type === "string") {
//       return "text";
//     }
//     return valueToFilter[0].type;
//   }

//   function handleComparerSelect(event: SelectChangeEvent<string>) {
//     const newExpression = { ...expression };
//     newExpression.expression = getComparer(event.target.value)[0];
//     newExpression.firstInput = "";
//     newExpression.secondInput = "";
//     setComparerSelected(event.target.value);
//   }

//   function getComparer(type: string | string[]) {
//     if (attributeSelected && keys.length) {
//       return comparerModes[getFeatureAttribute(attributeSelected)].filter(
//         (compAttribute) => type === compAttribute.value,
//       );
//     }

//     return [];
//   }

//   function handleAttributeSelect(event: SelectChangeEvent<string>) {
//     // const newExpression = { ...expression };
//     // newExpression.attribute = {
//     //   type: getFeatureAttribute(event.target.value),
//     //   name: event.target.value,
//     // };
//     setAttributeSelected(event.target.value);
//   }

//   function toggleMorePopover() {
//     setAnchorEl(!anchorEl);
//   }

//   return (
//     <>
//       <Box key={v4()}>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginTop: theme.spacing(4),
//             padding: "9.5px 0",
//           }}
//         >
//           <Typography
//             variant="body2"
//             sx={{
//               color: theme.palette.text.secondary,
//               fontWeight: "600",
//             }}
//           >
//             {t("panels.filter.expression")}
//           </Typography>
//           <Box sx={{ position: "relative" }}>
//             <Button
//               id="basic-button"
//               aria-controls={open ? "basic-menu" : undefined}
//               aria-haspopup="true"
//               aria-expanded={open ? "true" : undefined}
//               onClick={toggleMorePopover}
//               variant="text"
//               disabled={mapLoading}
//             >
//               <Icon iconName={ICON_NAME.ELLIPSIS} />
//             </Button>
//             {open ? (
//               <CustomMenu close={toggleMorePopover}>
//                 <MenuList>
//                   <MenuItem onClick={() => deleteOneExpression(expression.id)}>
//                     {t("panels.filter.delete_expression")}
//                   </MenuItem>
//                   <MenuItem onClick={() => duplicateExpression(expression.id)}>
//                     {t("panels.filter.duplicate")}
//                   </MenuItem>
//                 </MenuList>
//               </CustomMenu>
//             ) : null}
//           </Box>
//         </Box>
//         <FormControl
//           fullWidth
//           size="small"
//           sx={{
//             margin: `${theme.spacing(1)} 0`,
//           }}
//         >
//           <InputLabel id="demo-simple-select-label">
//             {t("panels.filter.select_attribute")}
//           </InputLabel>
//           <Select
//             label={t("panels.filter.select_attribute")}
//             disabled={!keys.length || mapLoading}
//             defaultValue={attributeSelected ? attributeSelected : ""}
//             onChange={handleAttributeSelect}
//           >
//             {keys.length
//               ? keys.map((key) => (
//                   <MenuItem key={v4()} value={key.name}>
//                     {key.name}
//                   </MenuItem>
//                 ))
//               : null}
//           </Select>
//         </FormControl>
//         <FormControl
//           size="small"
//           fullWidth
//           sx={{
//             margin: `${theme.spacing(1)} 0`,
//           }}
//         >
//           <InputLabel id="demo-simple-select-label">
//             {t("panels.filter.select_an_expression")}
//           </InputLabel>
//           <Select
//             label={t("panels.filter.select_an_expression")}
//             disabled={!keys.length || mapLoading}
//             defaultValue={comparerSelected ? comparerSelected : ""}
//             onChange={handleComparerSelect}
//           >
//             {keys.length
//               ? attributeSelected.length &&
//                 comparerModes[getFeatureAttribute(attributeSelected)].map(
//                   (key) => (
//                     <MenuItem key={v4()} value={key.value}>
//                       {key.label}
//                     </MenuItem>
//                   ),
//                 )
//               : null}
//           </Select>
//         </FormControl>
//         {children}
//       </Box>
//     </>
//   );
// };

// const Exppression = (props: ExpressionProps) => {
//   const {
//     isLast,
//     expression,
//     logicalOperator,
//     id,
//     keys,
//     deleteOneExpression,
//     duplicateExpression,
//   } = props;
//   console.log(expression);
//   const memoExpression = useMemo(() => expression, [expression]);
//   const [attributeSelected, setAttributeSelected] = useState<string | string[]>(
//     memoExpression.attribute ? memoExpression.attribute : "",
//   );
//   console.log(memoExpression.attribute);
//   const [comparerSelected, setComparerSelected] = useState<string | string[]>(
//     memoExpression.expression ? memoExpression.expression.value : "",
//   );

//   const theme = useTheme();
//   const { t } = useTranslation("maps");

//   function getFeatureAttribute(type: string | string[]) {
//     const valueToFilter = keys.filter((key) => key.name === type);
//     if (valueToFilter.length && valueToFilter[0].type === "string") {
//       return "text";
//     }
//     return valueToFilter.length && valueToFilter[0].type;
//   }

//   function getComparer(type: string | string[]) {
//     if (attributeSelected && keys.length) {
//       return comparerModes[getFeatureAttribute(attributeSelected)].filter(
//         (compAttribute) => type === compAttribute.value,
//       );
//     }

//     return [];
//   }

//   return (
//     <>
//       <ExpressionAttributes
//         keys={keys}
//         attributeSelected={attributeSelected}
//         setComparerSelected={setComparerSelected}
//         comparerSelected={comparerSelected}
//         expression={expression}
//         setAttributeSelected={setAttributeSelected}
//         deleteOneExpression={deleteOneExpression}
//         duplicateExpression={duplicateExpression}
//       >
//         {attributeSelected.length ? (
//           <>
//             {comparerSelected.length ? (
//               <FilterOptionField
//                 comparer={
//                   attributeSelected.length
//                     ? [...getComparer(comparerSelected)][0]
//                     : null
//                 }
//                 prop={
//                   typeof attributeSelected === "string" ? attributeSelected : ""
//                 }
//                 expressionId={id}
//                 expression={memoExpression}
//               />
//             ) : null}
//           </>
//         ) : null}
//       </ExpressionAttributes>
//       {isLast ? (
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             marginTop: theme.spacing(8),
//           }}
//         >
//           <Chip
//             label={
//               logicalOperator === "match_all_expressions"
//                 ? t("panels.filter.and")
//                 : t("panels.filter.or")
//             }
//           />
//         </Box>
//       ) : null}
//     </>
//   );
// };

// export default Exppression;

const ExpressionAttributes = () => {
  return <></>;
};

export default ExpressionAttributes;
