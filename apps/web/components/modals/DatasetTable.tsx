import { FieldTypeTag } from "@/components/map/common/LayerFieldSelector";
import useLayerFields from "@/hooks/map/CommonHooks";
import { useDatasetCollectionItems } from "@/lib/api/layers";
import { IconButton, Skeleton } from "@mui/material";

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
import { useEffect, useState } from "react";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import NoValuesFound from "@/components/map/common/NoValuesFound";

interface DatasetTableDialogProps {
  open: boolean;
  onClose?: () => void;
  disabled?: boolean;
  dataset: ProjectLayer | Layer;
}

const DatasetTableModal: React.FC<DatasetTableDialogProps> = ({
  open,
  onClose,
  dataset,
}) => {
  const { layerFields: fields, isLoading: areFieldsLoading } = useLayerFields(
    dataset["layer_id"] || dataset["id"] || "",
  );
  const [dataQueryParams, setDataQueryParams] =
    useState<GetCollectionItemsQueryParams>({
      limit: 50,
      offset: 0,
    });
  const { data } = useDatasetCollectionItems(
    dataset["layer_id"] || dataset["id"] || "",
    dataQueryParams,
  );

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
                {fields.map((field, index) => (
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
                  <TableRow key={row.id}>
                    {fields.map((field, fieldIndex) => (
                      <TableCell key={fieldIndex}>
                        {row.properties[field.name]}
                      </TableCell>
                    ))}
                  </TableRow>
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
