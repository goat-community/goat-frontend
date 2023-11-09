"use client";

import type { PopperMenuItem } from "@/components/common/PopperMenu";
import { useTranslation } from "@/i18n/client";
import {
  Avatar,
  Box,
  Divider,
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
  useTheme,
} from "@mui/material";
import MoreMenu from "@/components/common/PopperMenu";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { useMemo, useState } from "react";
import type { Order } from "@/lib/utils/helpers";
import { getComparator, stableSort } from "@/lib/utils/helpers";
import type { OrganizationMember } from "@/lib/validations/organization";
import { LoadingButton } from "@mui/lab";
import { useOrgMemberSettingsMoreMenu } from "@/hooks/dashboard/SettingsHooks";
import OrgMemberDialogWrapper from "@/components/modals/settings/OrgMembersDialogWrapper";
import type { OrgMemberActions } from "@/types/common";
import OrgMemberInviteModal from "@/components/modals/settings/InviteOrgMember";

const tableData: OrganizationMember[] = [
  {
    id: "1",
    avatar: "https://assets.plan4better.de/img/no-user-thumb.jpg",
    email: "majkshkurti94@gmail.com",
    invitation_status: "accepted",
    roles: ["Admin"],
  },
];

const OrganizationMembers = () => {
  const theme = useTheme();
  const { t } = useTranslation(["dashboard", "common"]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] =
    useState<keyof Omit<OrganizationMember, "roles">>("email");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchFilter, setSearchFilter] = useState<string>("");

  const {
    activeMemberMoreMenuOptions,
    pendingInvitationMoreMenuOptions,
    activeMember,
    moreMenuState,
    closeMoreMenu,
    openMoreMenu,
  } = useOrgMemberSettingsMoreMenu();
  const [openInviteModal, setOpenInviteModal] = useState(false);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(event.target.value);
  };

  const _handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Omit<OrganizationMember, "roles">,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  console.log(_handleRequestSort);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData.length) : 0;

  const filteredData = useMemo(() => {
    const comparator = getComparator(order, orderBy);
    const sortedData = stableSort(tableData, comparator).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
    return sortedData.filter((row: OrganizationMember) => {
      if (searchFilter === "") return true;
      return row.email.toLowerCase().includes(searchFilter.toLowerCase());
    });
  }, [order, orderBy, page, rowsPerPage, searchFilter]);

  return (
    <Box sx={{ p: 4 }}>
      {activeMember && moreMenuState && (
        <OrgMemberDialogWrapper
          member={activeMember}
          action={moreMenuState.id as OrgMemberActions}
          onClose={closeMoreMenu}
          onMemberDelete={closeMoreMenu}
        />
      )}
      <OrgMemberInviteModal
        open={openInviteModal}
        onClose={() => setOpenInviteModal(false)}
        onInvite={() => {
          console.log("invite");
        }}
      />
      <Box>
        <Stack spacing={theme.spacing(6)}>
          <Divider />
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {t("organization_manage_users")}
            </Typography>
            <Typography variant="caption">
              {t("organization_manage_users_description")}
            </Typography>
          </Box>
          <Divider />

          <TableContainer>
            <Stack
              direction="row"
              spacing={8}
              justifyContent="space-between"
              alignItems="center"
              sx={{
                my: 4,
              }}
            >
              <TextField
                sx={{ width: "80%" }}
                placeholder={t("dashboard:filter_by_email")}
                type="search"
                value={searchFilter}
                InputProps={{
                  startAdornment: (
                    <Icon
                      iconName={ICON_NAME.SEARCH}
                      style={{ fontSize: 17, marginLeft: 2, marginRight: 10 }}
                    />
                  ),
                }}
                onChange={handleSearchFilter}
              />
              <LoadingButton
                variant="contained"
                onClick={() => setOpenInviteModal(true)}
                startIcon={<Icon fontSize="small" iconName={ICON_NAME.PLUS} />}
                aria-label="send-invite"
                name="send-invite"
              >
                {t("dashboard:new_org_member")}
              </LoadingButton>
            </Stack>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="organization members table"
            >
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Email</TableCell>
                  <TableCell>Roles</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row: OrganizationMember) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Avatar alt={row.email} src={row.avatar} />
                    </TableCell>

                    <TableCell component="th" scope="row">
                      {row.email}
                    </TableCell>
                    {row.invitation_status === "pending" ? (
                      <TableCell component="th" scope="row">
                        <Typography variant="body1">
                          {t("invitation_pending")}
                        </Typography>
                      </TableCell>
                    ) : (
                      <TableCell>{row.roles.toString()}</TableCell>
                    )}

                    {row.invitation_status === "accepted" && (
                      <TableCell align="right">
                        <MoreMenu
                          menuItems={activeMemberMoreMenuOptions}
                          menuButton={
                            <IconButton size="medium">
                              <Icon
                                iconName={ICON_NAME.MORE_VERT}
                                fontSize="small"
                              />
                            </IconButton>
                          }
                          onSelect={(menuItem: PopperMenuItem) => {
                            openMoreMenu(menuItem, row);
                          }}
                        />
                      </TableCell>
                    )}
                    {row.invitation_status === "pending" && (
                      <TableCell align="right">
                        <MoreMenu
                          menuItems={pendingInvitationMoreMenuOptions}
                          menuButton={
                            <IconButton size="medium">
                              <Icon
                                iconName={ICON_NAME.MORE_VERT}
                                fontSize="small"
                              />
                            </IconButton>
                          }
                          onSelect={(menuItem: PopperMenuItem) => {
                            openMoreMenu(menuItem, row);
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
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={tableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Stack>
      </Box>
    </Box>
  );
};

export default OrganizationMembers;
