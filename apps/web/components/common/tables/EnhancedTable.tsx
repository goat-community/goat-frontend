import {
  Box,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  tableCellClasses,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import * as React from "react";
import { v4 } from "uuid";

import { changeColorOpacity } from "@/lib/utils/helpers";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material";

const CustomTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "transparent",
  "&:nth-of-type": {},
  "&:nth-of-type(odd)": {
    backgroundColor: (props) =>
      props.alternativeColors
        ? changeColorOpacity({
            color: theme.palette.primary.main,
            opacity: 0.08,
          })
        : "transparent",
    borderColor: changeColorOpacity({
      color: theme.palette.primary.main,
      opacity: 0.08,
    }),
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: (props) => (props.alternativeColors ? 0 : ""),
  },
  "&.MuiTableRow-hover:hover": {
    background: theme.palette.secondary.dark,
  },
}));

const CustomTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "transparent",
    color: theme.palette.primary.main,
    fontWeight: "bold",
    borderBottom: `0.5px solid ${theme.palette.secondary.main}20`,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: "none",
    borderBottom: (props) =>
      props.alternativeColors
        ? "none"
        : `0.5px solid ${theme.palette.secondary.main}`,
  },
  // paddingLeft: (props) => (props.checkbox ? 0 : theme.spacing(3)),
}));

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number,
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: any) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string | number;
  rowCount: number;
  columns: {
    id: string;
    numeric: boolean;
    label: string;
  }[];
  checkbox: boolean;
  action: React.ReactNode | null;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    columns,
    checkbox,
    action = null,
  } = props;

  const theme = useTheme();

  const createSortHandler =
    (property: any) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <CustomTableRow>
        {checkbox ? (
          <CustomTableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all desserts",
              }}
            />
          </CustomTableCell>
        ) : null}
        {columns.map((headCell) => (
          <CustomTableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              <Typography
                sx={{ fontWeight: "bold" }}
                variant="body2"
              >
                {headCell.label}
              </Typography>
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </CustomTableCell>
        ))}
        {action ? <CustomTableCell padding="checkbox" /> : null}
      </CustomTableRow>
    </TableHead>
  );
}

type EnhanceTableProps = {
  rows: { name: string; [key: string]: any }[];
  dense: boolean;
  // alternativeColors: boolean;
  hover?: boolean;
  columnNames: {
    id: string;
    numeric: boolean;
    label: string;
  }[];
  openDialog?: React.Dispatch<React.SetStateAction<any>>;
  // dialog?: { title: string; body: React.ReactNode; action: React.ReactNode };
  checkbox?: boolean;
  action?: React.ReactNode | null;
};

export default function EnhancedTable(props: EnhanceTableProps) {
  const {
    rows,
    columnNames,
    openDialog,
    dense,
    checkbox = true,
    action = null,
    hover = false,
  } = props;

  const theme = useTheme();

  type ObjectKeys = keyof (typeof rows)[0];
  const rowKeys: ObjectKeys[] = Object.keys(rows[0]) as ObjectKeys[];

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState(rowKeys[0]);
  const [selected, setSelected] = React.useState<(string | number)[]>([]);
  // const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
  //   null,
  // );
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const handleRequestSort = (
    _: React.MouseEvent<unknown>,
    property: keyof ObjectKeys,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_: React.MouseEvent<unknown>, name: string | number) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: any = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name: string | number) => selected.indexOf(name) !== -1;

  function openDialogInitializer(row: {
    [x: string]: string | number;
    [x: number]: string | number;
  }) {
    if (openDialog) {
      openDialog(row);
    }
  }

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rows],
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        sx={{
          boxShadow: "none",
          backgroundImage: "none",
          backgroundColor: "transparent",
          width: "100%",
          mb: 2,
        }}
      >
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              columns={columnNames}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              checkbox={checkbox}
              action={action}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <CustomTableRow
                    hover={hover}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={v4()}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    {checkbox ? (
                      <CustomTableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          onClick={(event) => handleClick(event, row.name)}
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </CustomTableCell>
                    ) : null}
                    {rowKeys &&
                      rowKeys.map((key, indx) => (
                        <CustomTableCell
                          key={v4()}
                          component="th"
                          align={columnNames[indx].numeric ? "right" : "left"}
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {["number", "string"].includes(typeof row[key]) ? (
                            <Typography
                              variant="body2"
                              sx={{
                                padding: dense ? `0px ${theme.spacing(3)}` : theme.spacing(4),
                                fontSize: "12px",
                              }}
                            >
                              {row[key]}
                            </Typography>
                          ) : (
                            row[key]
                          )}
                        </CustomTableCell>
                      ))}
                    {action ? (
                      <CustomTableCell padding="none">
                        <div onClick={() => openDialogInitializer(row)}>
                          {action}
                        </div>
                      </CustomTableCell>
                    ) : null}
                  </CustomTableRow>
                );
              })}
              {emptyRows > 0 && (
                <CustomTableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <CustomTableCell colSpan={6} />
                </CustomTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
