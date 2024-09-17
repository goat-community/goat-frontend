import {
  Avatar,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";

import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";

import { useTranslation } from "@/i18n/client";

import type { Order } from "@/lib/utils/helpers";
import { getComparator, stableSort } from "@/lib/utils/helpers";
import type { OrganizationMember } from "@/lib/validations/organization";
import type { TeamMember } from "@/lib/validations/team";

import type { PopperMenuItem } from "@/components/common/PopperMenu";
import MoreMenu from "@/components/common/PopperMenu";

type Member = OrganizationMember | TeamMember;

export interface MembersTableProps {
  members: Member[];
  memberRoles: string[];
  activeMemberMoreMenuOptions: PopperMenuItem[];
  pendingInvitationMoreMenuOptions: PopperMenuItem[];
  onMoreMenuItemClick: (menuItem: PopperMenuItem, memberItem: Member) => void;
  type: "organization" | "team";
  viewOnly?: boolean;
}

const MembersTable = ({
  members,
  memberRoles,
  activeMemberMoreMenuOptions,
  pendingInvitationMoreMenuOptions,
  onMoreMenuItemClick,
  type,
  viewOnly,
}: MembersTableProps) => {
  const { data: session } = useSession();
  const { t } = useTranslation("common");
  const handleSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(event.target.value);
  };
  const [page, setPage] = useState(0);
  const [order, _setOrder] = useState<Order>("asc");
  const [orderBy, _setOrderBy] = useState<keyof Omit<Member, "roles">>("email");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const emptyRows = useMemo(() => {
    if (members) {
      return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - members.length) : 0;
    } else {
      return 0;
    }
  }, [page, rowsPerPage, members]);

  const filteredData = useMemo(() => {
    if (!members) return [];
    const comparator = getComparator(order, orderBy);
    const sortedData = stableSort(members, comparator).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
    return sortedData.filter((row: Member) => {
      if (searchFilter === "") return true;
      return row.email.toLowerCase().includes(searchFilter.toLowerCase());
    });
  }, [members, order, orderBy, page, rowsPerPage, searchFilter]);

  return (
    <Stack>
      <TableContainer>
        <Stack
          direction="row"
          spacing={8}
          justifyContent="space-between"
          alignItems="center"
          sx={{
            my: 4,
          }}>
          <TextField
            fullWidth
            placeholder={t("filter_members_by_email")}
            type="search"
            value={searchFilter}
            InputProps={{
              startAdornment: (
                <Icon iconName={ICON_NAME.SEARCH} style={{ fontSize: 17, marginLeft: 2, marginRight: 10 }} />
              ),
            }}
            onChange={handleSearchFilter}
          />
        </Stack>
        <Table sx={{ minWidth: 650 }} aria-label="members table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>{t("member")}</TableCell>
              <TableCell>{t("role")}</TableCell>
              {type === "organization" && <TableCell>{t("status")}</TableCell>}
              {!viewOnly && <TableCell align="right" />}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row: Member) => (
              <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row" sx={{ width: "40px", pr: 0 }} align="right">
                  <Avatar alt={row.email} src={row.avatar} />
                </TableCell>
                <TableCell component="th" scope="row">
                  <Stack>
                    <Typography variant="body2">{`${row.firstname} ${row.lastname}`}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {row.email}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell component="th" scope="row">
                  {row?.["roles"]
                    ?.filter((role) => memberRoles.includes(role as string))
                    .map((role) => t(role))
                    .join(", ")}
                  {row?.["role"] ? t(row?.["role"]) : ""}
                </TableCell>
                {type === "organization" && row.invitation_status === "pending" ? (
                  <TableCell component="th" scope="row">
                    <Typography variant="body1">{t("invitation_pending")}</Typography>
                  </TableCell>
                ) : (
                  type === "organization" && <TableCell>{t("member")}</TableCell>
                )}
                {!viewOnly &&
                  row.invitation_status === "accepted" &&
                  row.email !== session?.user?.email &&
                  !row?.["roles"]?.includes("owner") && (
                    <TableCell align="right">
                      <MoreMenu
                        menuItems={activeMemberMoreMenuOptions}
                        menuButton={
                          <IconButton size="medium">
                            <Icon iconName={ICON_NAME.MORE_VERT} fontSize="small" />
                          </IconButton>
                        }
                        onSelect={(menuItem: PopperMenuItem) => {
                          onMoreMenuItemClick(menuItem, row);
                        }}
                      />
                    </TableCell>
                  )}
                {!viewOnly && row.email === session?.user?.email && (
                  <TableCell align="right">
                    <Typography variant="body1" />
                  </TableCell>
                )}
                {!viewOnly && row.invitation_status === "pending" && (
                  <TableCell align="right">
                    <MoreMenu
                      menuItems={pendingInvitationMoreMenuOptions}
                      menuButton={
                        <IconButton size="medium">
                          <Icon iconName={ICON_NAME.MORE_VERT} fontSize="small" />
                        </IconButton>
                      }
                      onSelect={(menuItem: PopperMenuItem) => {
                        onMoreMenuItemClick(menuItem, row);
                      }}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 53 * emptyRows,
                }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={members.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Stack>
  );
};

export default MembersTable;
