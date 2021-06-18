import React from "react";
import { Box, InputLabel, OutlinedInput } from "@material-ui/core";
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
  testId?: string;
};

const defaultProps = {
  testId: "",
};

const TextInput = ({ id, label, value, onChange, testId }: Props) => {
  const classes = useStyles();
  return (
    <Box display="flex" flexDirection="row" alignItems="center" marginY={2}>
      {/* hidden input to disable autocomplete: https://gist.github.com/niksumeiko/360164708c3b326bd1c8#gistcomment-3716208 */}
      <Box display="none" aria-hidden="true">
        <input tabIndex={-1} />
      </Box>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput
        id={id}
        className={classes.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="new-password" // disable autocomplete
        inputProps={{ "data-testid": testId }}
      />
    </Box>
  );
};
TextInput.defaultProps = defaultProps;

export default TextInput;
