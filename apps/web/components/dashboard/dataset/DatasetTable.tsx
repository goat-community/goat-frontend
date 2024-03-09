import { FieldTypeTag } from "@/components/map/common/LayerFieldSelector";
import useLayerFields from "@/hooks/map/CommonHooks";
import { useDatasetCollectionItems } from "@/lib/api/layers";
import { Box, Skeleton } from "@mui/material";

import type {
  GetCollectionItemsQueryParams,
  Layer,
} from "@/lib/validations/layer";
import type { ProjectLayer } from "@/lib/validations/project";
import {
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
import NoValuesFound from "@/components/map/common/NoValuesFound";

interface DatasetTableProps {
  dataset: ProjectLayer | Layer;
}

const DatasetTable: React.FC<DatasetTableProps> = ({ dataset }) => {
  const { layerFields: fields, isLoading: areFieldsLoading } = useLayerFields(
    (dataset["id"] as string) || "",
    undefined,
    ["layer_id"],
  );

  const [dataQueryParams, setDataQueryParams] =
    useState<GetCollectionItemsQueryParams>({
      limit: 25,
      offset: 0,
    });
  const { data } = useDatasetCollectionItems(
    (dataset["id"] as string) || "",
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
    <Box>
      <Box
        sx={{
          height: `calc(100vh - 440px)`,
          overflowX: "hidden",
        }}
      >
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
      </Box>
      {displayData && (
        <TablePagination
          sx={{ mt: 2 }}
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
    </Box>
  );
};

export default DatasetTable;
