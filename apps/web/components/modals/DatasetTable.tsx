import { FieldTypeTag } from "@/components/map/common/LayerFieldSelector";
import useLayerFields from "@/hooks/map/CommonHooks";
import { useDatasetCollectionItems } from "@/lib/api/layers";
import { Box, Collapse, IconButton, Skeleton } from "@mui/material";

import type {
  GetCollectionItemsQueryParams,
  Layer,
} from "@/lib/validations/layer";
import type { ProjectLayer } from "@/lib/validations/project";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useEffect, useMemo, useState } from "react";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import NoValuesFound from "@/components/map/common/NoValuesFound";

interface DatasetTableDialogProps {
  open: boolean;
  onClose?: () => void;
  disabled?: boolean;
  dataset: ProjectLayer | Layer;
}

const Row = ({ row, fields }) => {
  const [open, setOpen] = useState(false);

  const primitiveFields = useMemo(
    () => fields.filter((field) => field.type !== "object"),
    [fields],
  );

  const objectFields = useMemo(
    () => fields.filter((field) => field.type === "object"),
    [fields],
  );

  return (
    <>
      <TableRow key={row.id}>
        {objectFields.length > 0 && (
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        {primitiveFields.map((field, fieldIndex) => (
          <TableCell key={fieldIndex}>{row.properties[field.name]}</TableCell>
        ))}
      </TableRow>

      {!!objectFields.length && (
        <TableRow>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={primitiveFields.length + 1}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 2 }}>
                {objectFields.map((field) => {
                  const jsonData = JSON.parse(row.properties[field.name]);
                  return (
                    <>
                      <Stack direction="column" spacing={1} sx={{ py: 1, pl: 4 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {field.name}
                        </Typography>
                        <FieldTypeTag fieldType={field.type}>
                          {field.type}
                        </FieldTypeTag>
                      </Stack>
                      <Table
                        size="small"
                        aria-label="purchases"
                        key={field.name}
                      >
                        <TableHead>
                          <TableRow>
                            {jsonData.length > 0 &&
                              Object.keys(jsonData[0]).map((key) => (
                                <TableCell key={key}>{key}</TableCell>
                              ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {jsonData.map((item, rowIndex) => (
                            <TableRow key={rowIndex}>
                              {Object.values(item).map((value: string, cellIndex) => (
                                <TableCell key={cellIndex}>{value}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </>
                  );
                })}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const DatasetTableModal: React.FC<DatasetTableDialogProps> = ({
  open,
  onClose,
  dataset,
}) => {
  const { layerFields: fields, isLoading: areFieldsLoading } = useLayerFields(
    dataset["layer_id"] || dataset["id"] || "",
    undefined,
  );
  const defaultParams = {
    limit: 50,
    offset: 0,
  };
  if (dataset["query"]) {
    defaultParams["filter"] = JSON.stringify(dataset["query"]);
  }
  const [dataQueryParams, setDataQueryParams] =
    useState<GetCollectionItemsQueryParams>(defaultParams);
  const { data } = useDatasetCollectionItems(
    dataset["layer_id"] || dataset["id"] || "",
    dataQueryParams,
  );

  console.log(data);

  const [displayData, setDisplayData] = useState(data);
  useEffect(() => {
    if (data) {
      setDisplayData(data);
    }
  }, [data]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setDataQueryParams((prev) => ({
      ...prev,
      offset: newPage * prev.limit,
    }));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setDataQueryParams({
      limit: parseInt(event.target.value, 10),
      offset: 0,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction="row" spacing={1} justifyContent="space-between">
          {`${dataset.name}`}
          <IconButton onClick={() => onClose && onClose()}>
            <Icon
              iconName={ICON_NAME.CLOSE}
              htmlColor="inherit"
              fontSize="small"
            />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ px: 0, mx: 0, pb: 0, minHeight: "250px" }}>
        {areFieldsLoading && !displayData && (
          <>
            <Skeleton variant="rectangular" height={60} sx={{ m: 4 }} />
            <Skeleton variant="rectangular" height={240} sx={{ m: 4 }} />
          </>
        )}

        {!areFieldsLoading && displayData && (
          <Table size="small" aria-label="simple table" stickyHeader>
            <TableHead>
              <TableRow>
                {fields.some((field) => field.type === "object") && (
                  <TableCell />
                )}
                {fields
                  .filter((field) => field.type !== "object")
                  .map((field, index) => (
                    <TableCell key={index}>
                      <Stack direction="column" spacing={1} sx={{ py: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {field.name}
                        </Typography>
                        <FieldTypeTag fieldType={field.type}>
                          {field.type}
                        </FieldTypeTag>
                      </Stack>
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayData.features.length === 0 && (
                <TableRow>
                  <TableCell
                    align="center"
                    colSpan={fields.length}
                    sx={{ borderBottom: "none" }}
                  >
                    <NoValuesFound />
                  </TableCell>
                </TableRow>
              )}
              {displayData.features?.length &&
                displayData.features.map((row) => (
                  <Row key={row.id} row={row} fields={fields} />
                ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions sx={{ pb: 0 }}>
        {displayData && (
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={displayData.numberMatched}
            rowsPerPage={dataQueryParams.limit}
            page={
              dataQueryParams.offset
                ? dataQueryParams.offset / dataQueryParams.limit
                : 0
            }
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DatasetTableModal;
