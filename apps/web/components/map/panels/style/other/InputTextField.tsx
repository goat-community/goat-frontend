import { OutlinedInput } from "@mui/material";

const InputTextField = ({
  value,
  onChange,
  onBlur,
  min = 0,
  max = 100,
  step = 1,
}: {
  value: number | number[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  min?: number;
  max?: number;
  step?: number;
}) => {
  return (
    <OutlinedInput
      value={value}
      size="small"
      onChange={onChange}
      onBlur={onBlur}
      sx={{ pr: 0 }}
      inputProps={{
        step: step,
        min: min,
        max: max,
        type: "number",
        style: {
          width: "50px",
          padding: "0px 0px 0px 10px",
          height: "32px",
          fontSize: "0.75rem",
        },
      }}
    />
  );
};

export default InputTextField;
