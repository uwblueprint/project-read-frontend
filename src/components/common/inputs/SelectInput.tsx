import React from "react";

import { MenuItem, Select } from "@material-ui/core";

import { StringInputProps } from "types";

type Props = StringInputProps & {
  options: string[];
};

const SelectInput = ({
  className,
  id,
  label,
  value,
  onChange,
  options,
  testId,
}: Props) => (
  <Select
    className={className}
    labelId={id}
    aria-label={label}
    value={value}
    onChange={(e) => onChange(e.target.value as string)}
    fullWidth
    variant="outlined"
    inputProps={{ "data-testid": testId }}
  >
    <MenuItem value="">None</MenuItem>
    {options.map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ))}
  </Select>
);

export default SelectInput;
