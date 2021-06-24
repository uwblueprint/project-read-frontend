import React from "react";
import { Box, InputLabel, OutlinedInput } from "@material-ui/core";
import { StringInputProps } from "../../../types";

const TextInput = ({
  id,
  label,
  value,
  onChange,
  inputWidth,
  testId,
}: StringInputProps) => (
  <Box display="flex" flexDirection="row" alignItems="center" marginY={2}>
    {/* hidden input to disable autocomplete: https://gist.github.com/niksumeiko/360164708c3b326bd1c8#gistcomment-3716208 */}
    <Box display="none" aria-hidden="true">
      <input aria-hidden="true" tabIndex={-1} />
    </Box>
    <Box paddingRight={2} width={150}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
    </Box>
    <Box width={inputWidth}>
      <OutlinedInput
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="new-password" // disable autocomplete
        inputProps={{ "data-testid": testId }}
        fullWidth
      />
    </Box>
  </Box>
);

export default TextInput;
