import TeamModalBody from "./TeamModalBody";
import React, { useState } from "react";

import type { Option } from "@p4b/types/atomicComponents";
import Modal from "@/components/common/Modal";
import { Button, IconButton, Typography, useTheme, Box } from "@mui/material";
import type { ITeam } from "@/types/dashboard/organization";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";

interface AddTeamModalProps {
  visibility: boolean;
  setVisibility: (value: boolean) => void;
  addTeam: (value: ITeam) => void;
}

const AddTeamModal = (props: AddTeamModalProps) => {
  const { visibility, setVisibility, addTeam } = props;

  const theme = useTheme();

  const [selectedOption, setSelectedOption] = useState<Option[] | undefined>(
    [],
  );
  const [teamName, setTeamName] = useState<string | null>(null);

  function saveTeam() {
    if (teamName && selectedOption && selectedOption.length) {
      addTeam({
        name: teamName,
        participants: selectedOption,
        createdAt: "23 Jun 19",
      });
      setSelectedOption([]);
      setVisibility(false);
    }
  }

  function handleClose() {
    setVisibility(false);
    setSelectedOption([]);
  }

  return (
    <Modal
      width="444px"
      open={visibility}
      changeOpen={setVisibility}
      action={
        <Box sx={{float: "right", marginTop: theme.spacing(3)}}>
          <Button onClick={handleClose} variant="text" color="primary">
            CANCEL
          </Button>
          <Button onClick={saveTeam} variant="text" color="primary">
            SAVE
          </Button>
        </Box>
      }
      header={
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "500" }}>
            New team
          </Typography>
          <IconButton onClick={handleClose}>
            <Icon
              iconName={ICON_NAME.XCLOSE}
              fontSize="small"
              htmlColor={theme.palette.text.secondary}
            />
          </IconButton>
        </Box>
      }
    >
      <TeamModalBody
        setSelectedOption={setSelectedOption}
        selectedOption={selectedOption}
        setTeamName={setTeamName}
      />
    </Modal>
  );
};

export default AddTeamModal;
