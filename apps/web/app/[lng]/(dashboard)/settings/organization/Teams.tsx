"use client";

import AddTeamModal from "@/components/dashboard/settings/organization/AddTeamModal";
import TeamsTable from "@/components/dashboard/settings/organization/TeamsTable";
import React, { useState } from "react";

import { Typography, Button, TextField, Box } from "@mui/material";

import Image from "next/image";
import type { ITeam } from "@/types/dashboard/organization";
import { useTheme } from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";

const Teams = () => {
  const [ismodalVisible, setModalVisible] = useState<boolean>(false);
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [searchWord, setSearchWord] = useState<string>("");

  const theme = useTheme();
  console.log(theme)

  function addTeam(team: ITeam) {
    setTeams([...teams, team]);
    setSearchWord("");
  }

  function editTeam(team: ITeam) {
    const updatedTeams = teams.map((singleTeam) => {
      if (singleTeam.name === team.name) {
        return team;
      }
      return singleTeam;
    });

    setTeams([...updatedTeams]);
  }

  return (
    <Box sx={{ marginBottom: theme.spacing(2) }}>
      <Box sx={{ padding: theme.spacing(3), paddingTop: "0" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing(2),
            marginBottom: theme.spacing(3),
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
          }}
        >
          <Icon
            iconName={ICON_NAME.USER}
            sx={{
              backgroundColor: `${theme.palette.secondary.dark}80`,
              fontSize: "20px",
              height: "1.5em",
              width: "1.5em",
              padding: "5px 7px",
              borderRadius: "100%",
            }}
            htmlColor={theme.palette.secondary.main}
          />
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Organization name
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: theme.spacing(4),
            marginBottom: theme.spacing(3),
          }}
        >
          <TextField
            sx={{ flexGrow: "1" }}
            type="text"
            label="Search"
            size="small"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSearchWord(event.target.value);
            }}
          />
          <Icon
            iconName={ICON_NAME.FILTER}
            fontSize="small"
            htmlColor={theme.palette.text.secondary}
          />
          <div style={{ position: "relative" }}>
            <Button
              sx={{ width: "131px" }}
              onClick={() => setModalVisible(true)}
            >
              New Team
            </Button>
          </div>
        </Box>
        <AddTeamModal
          visibility={ismodalVisible}
          setVisibility={setModalVisible}
          addTeam={addTeam}
        />
      </Box>
      {teams.length ? (
        <TeamsTable
          rawRows={teams}
          editTeam={editTeam}
          searchText={searchWord}
        />
      ) : (
        <Box
          sx={{
            marginTop: "22px",
            marginBottom: theme.spacing(5) + theme.spacing(3),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Image
            src="/assets/illustrations/teams.svg"
            alt=""
            width={400}
            height={300}
          />
          <Typography variant="h6" color="focus" sx={{ fontWeight: "500", marginBottom: "100px" }}>
            Create teams to easily manage your projects
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Teams;
