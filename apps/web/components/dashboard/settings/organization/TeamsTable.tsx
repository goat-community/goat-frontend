import { useUserDialog, useTeamSearch } from "@/hooks/dashboard/TeamsHooks";
import React, { useState } from "react";

import type { Option } from "@p4b/types/atomicComponents";
import EnhancedTable from "@/components/common/tables/EnhancedTable";
import Modal from "@/components/common/Modal";
import { Card, IconButton, Typography, Button, useTheme, Box } from "@mui/material";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";

import TeamModalBody from "./TeamModalBody";
import type { ITeam } from "@/types/dashboard/organization";

interface TeamsTableProps {
  rawRows: ITeam[];
  editTeam: (value: ITeam) => void;
  searchText?: string;
}

const TeamsTable = (props: TeamsTableProps) => {
  const { rawRows, editTeam, searchText } = props;

  const [userInDialog, setUserInDialog] = useState<ITeam | boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option[] | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null);

  const theme = useTheme(); 

  const { saveEditTeam } = useUserDialog({
    rawRows,
    userInDialog,
    setUserInDialog,
    selectedOption,
    searchText,
    editTeam,
    teamName,
    setTeamName,
    setSelectedOption,
  });

  const rows = useTeamSearch(rawRows, searchText);

  const columnNames = [
    {
      id: "1",
      numeric: false,
      label: "Team",
    },
    {
      id: "2",
      numeric: true,
      label: "Users",
    },
    {
      id: "3",
      numeric: true,
      label: "Creation",
    },
  ];

  return (
    <Card sx={{padding: theme.spacing(3),}}>
      {rows && rows.length ? (
        <EnhancedTable
          rows={[
            ...rows.map((row) => ({
              name: row.name,
              count: row.participants.length,
              createdAt: row.createdAt,
            })),
          ]}
          dense={false}
          columnNames={columnNames}
          openDialog={setUserInDialog}
          action={
            <IconButton>
              <Icon iconName={ICON_NAME.EDIT} sx={{fontSize: "15px"}}/>
            </IconButton>
          }
          checkbox={false}
          hover={true}
        />
      ) : (
        <Typography variant="body1" color="secondary">
          No results
        </Typography>
      )}
      <Modal
        header={
          <Box sx={{display: "flex",
          justifyContent: "space-between",
          alignItems: "center",}}>
            <Typography variant="h6" sx={{fontWeight: "500",}}>
              Edit Team
            </Typography>
            <IconButton>
              <Icon iconName={ICON_NAME.XCLOSE} />
            </IconButton>
          </Box>
        }
        action={
          <Box sx={{float: "right", marginTop: theme.spacing(3)}}>
            <Button onClick={() => setUserInDialog(false)} variant="text">
              CANCEL
            </Button>
            <Button onClick={saveEditTeam} variant="text">
              SAVE
            </Button>
          </Box>
        }
        width="444px"
        open={userInDialog ? true : false}
        changeOpen={setUserInDialog}
      >
        {userInDialog && typeof userInDialog !== "boolean" ? (
          <TeamModalBody
            selectedEditRow={userInDialog}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            setTeamName={setTeamName}
          />
        ) : null}
      </Modal>
    </Card>
  );
};

export default TeamsTable;
