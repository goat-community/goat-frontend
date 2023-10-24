import type { Dayjs } from "dayjs";
import React from "react";
import TextInputSelect from "./inputFields/TextInputSelect";
import { dummyFilterDataText, dummyFilterDataNumber } from "@/public/assets/data/filterDummy";
import { DatePicker } from "@mui/lab";
import { TextField } from "@mui/material";

interface simpleInput {
  value: string | undefined;
  setChange: (value: string) => void;
}

export const NumberOption = (props: simpleInput) => {
  const { value, setChange } = props;

  return (
    <div style={{marginBottom: "8px"}}>
      <TextInputSelect setInputValue={setChange} inputValue={value ? value : ""} options={dummyFilterDataNumber} type="number"/>
    </div>
  );
};

interface DateOptionProp {
  initValue: Dayjs | null;
  onValue: (value: Dayjs | null) => void;
}

export const DateOption = (props: DateOptionProp) => {
  const { initValue, onValue } = props;

  return (
    <div>
      <DatePicker onChange={onValue} value={initValue} size="small" />
    </div>
  );
};

export const TextOption = (props: simpleInput) => {
  const { value, setChange } = props;

  return (
    <div>
      <TextInputSelect setInputValue={setChange} inputValue={value ? value : ""} options={dummyFilterDataText}/>
    </div>
  );
};

// interface SelectOptionProps {
//   options: { name: React.ReactNode; value: string }[];
//   label: string;
// }

export const SelectOption = () => {
  // const { options, label } = props;

  return (
    <div>
      {/* <TextField select options={options} size="small" label={label} /> */}
    </div>
  );
};

export const DualNumberOption = () => {
  return (
    <div>
      <TextField type="number" size="small" />
      <TextField type="number" size="small" />
    </div>
  );
};

export const YearFilterOption = () => {
  // const options = [
  //   {
  //     name: "minutes",
  //     value: "minutes",
  //   },
  //   {
  //     name: "hours",
  //     value: "hours",
  //   },
  //   {
  //     name: "days",
  //     value: "days",
  //   },
  //   {
  //     name: "weeks",
  //     value: "weeks",
  //   },
  //   {
  //     name: "months",
  //     value: "months",
  //   },
  //   {
  //     name: "years",
  //     value: "years",
  //   },
  // ];

  return (
    <div>
      <TextField type="number" size="small" />
      {/* <SelectField options={options} size="small" label="" /> */}
    </div>
  );
};

export const DualDateOption = (props: { first: DateOptionProp; second: DateOptionProp }) => {
  const { first, second } = props;

  return (
    <div>
      <DatePicker onChange={first.onValue} value={first.initValue} size="small" />
      <DatePicker onChange={second.onValue} value={second.initValue} size="small" />
    </div>
  );
};
