import React from "react";
import { Box, InputLabel, MenuItem, Select } from "@material-ui/core";
import { InputProps } from "../../../types";

type Props = InputProps & {
  options: string[];
};

const SelectInput = ({
  id,
  label,
  value,
  onChange,
  options,
  inputWidth,
  testId,
}: Props) => (
  <Box display="flex" flexDirection="row" alignItems="center" marginY={2}>
    <Box paddingRight={2} width={150}>
      <InputLabel id={id}>{label}</InputLabel>
    </Box>
    <Box width={inputWidth}>
      <Select
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
    </Box>
  </Box>
);

export default SelectInput;
