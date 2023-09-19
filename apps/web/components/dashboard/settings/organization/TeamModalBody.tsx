import type { Option } from "@p4b/types/atomicComponents";
import type { ITeam } from "@/types/dashboard/organization";
import React, { useState } from "react";
import { v4 } from "uuid";
import {
  Autocomplete,
  TextField,
  Chip,
  Checkbox,
  Typography,
  useTheme,
  Box,
} from "@mui/material";

interface TeamModalBodyProps {
  selectedEditRow?: ITeam;
  setSelectedOption?: (value: Option[]) => void;
  selectedOption?: Option[] | null;
  setTeamName?: (value: string) => void;
}

const TeamModalBody = (props: TeamModalBodyProps) => {
  const [selected, setSelected] = useState<Option[]>([]);
  const { selectedEditRow, setSelectedOption, selectedOption, setTeamName } =
    props;

  const theme = useTheme();

  const options = [
    {
      label: "Sumaya Randolph",
      value: "sumaya",
      selected: false,
    },
    {
      label: "Priya Phelps",
      value: "priya",
      selected: false,
    },
    {
      label: "Amanda Dickson",
      value: "amanda",
      selected: false,
    },
    {
      label: "Alia Campbell",
      value: "alia",
      selected: false,
    },
    {
      label: "Cole Chaney",
      value: "cole",
      selected: false,
    },
    {
      label: "Idris Lowery",
      value: "idris",
      selected: false,
    },
  ];

  function changeStatusOfUser(user: Option, status: boolean) {
    if (selectedOption) {
      selectedOption?.forEach((userSelected) => {
        if (userSelected.label === user.label) {
          userSelected.selected = status;
        }
      });
    }

    if (setSelectedOption) {
      setSelectedOption(selectedOption ? [...selectedOption] : []);
    }
  }

  const handleChange = (value: Option | Option[] | null) => {
    if (setSelectedOption && Array.isArray(value)) {
      setSelectedOption([
        ...selected,
        ...value.map((val) => {
          const newVal = val;
          newVal.selected = true;
          return newVal;
        }),
      ]);
    }
  };

  const getSelectedOptions = () => {
    const selectedOptions = options.filter(
      (option) =>
        selectedOption &&
        selectedOption.some((vendor) => vendor.label === option.label),
    );

    console.log(selectedOptions, selectedOption);
    return selectedOptions;
  };

  return (
    <>
      <Box sx={{ marginBottom: theme.spacing(5) }}>
        <Typography
          variant="body2"
          sx={{ paddingBottom: theme.spacing(2), fontWeight: "bold" }}
        >
          Team name
        </Typography>
        <TextField
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setTeamName ? setTeamName(event.target.value) : null
          }
          sx={{ width: "100%" }}
          defaultValue={selectedEditRow ? selectedEditRow.name : ""}
          size="small"
          type="text"
        />
      </Box>
      <Box sx={{ marginBottom: theme.spacing(5) }}>
        <Typography
          variant="body2"
          sx={{ paddingBottom: theme.spacing(2), fontWeight: "bold" }}
        >
          Add users
        </Typography>
        <Autocomplete
          multiple={true}
          options={options}
          disableCloseOnSelect
          size="small"
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox checked={selected} />
              {option.label}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Select Options"
            />
          )}
          onChange={(_, value) => {
            handleChange(value);
          }}
          value={getSelectedOptions()}
          renderTags={() => null}
        />
      </Box>
      <div>
        {selectedOption && selectedOption.length ? (
          <>
            <Typography
              variant="body2"
              sx={{ paddingBottom: theme.spacing(2), fontWeight: "bold" }}
            >
              User list
            </Typography>
            {selectedOption.map((option) => (
              <Box
                sx={{
                  display: "flex",
                  marginTop: theme.spacing(3),
                  justifyContent: "space-between",
                }}
                key={v4()}
              >
                <Box sx={{ display: "flex", gap: theme.spacing(1) }}>
                  <Checkbox
                    checked={
                      typeof option.selected === "boolean"
                        ? option.selected
                        : false
                    }
                    onChange={(_: React.SyntheticEvent, value: boolean) =>
                      changeStatusOfUser(option, false)
                    }
                  />
                  <div>
                    <Typography variant="body2">{option.label}</Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontStyle: "italic" }}
                      color="secondary"
                    >
                      user@email.com
                    </Typography>
                  </div>
                </Box>
                <Chip label="invited" />
              </Box>
            ))}
          </>
        ) : null}
      </div>
    </>
  );
};

export default TeamModalBody;
