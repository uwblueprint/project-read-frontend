import React from "react";
import { Box, InputLabel, MenuItem, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  input: {
    width: 328,
  },
}));

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  testId?: string;
};

const defaultProps = {
  testId: "",
};

const TextInput = ({ id, label, value, onChange, options, testId }: Props) => {
  const classes = useStyles();
  return (
    <Box display="flex" flexDirection="row" alignItems="center" marginY={2}>
      <InputLabel id={id}>{label}</InputLabel>
      <Select
        data-testid={testId}
        labelId={id}
        aria-label={id}
        className={classes.input}
        value={value}
        onChange={(e) => onChange(e.target.value as string)}
        fullWidth
        variant="outlined"
      >
        <MenuItem value="">None</MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};
TextInput.defaultProps = defaultProps;

export default TextInput;
