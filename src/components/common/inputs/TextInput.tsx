import React from "react";

import { OutlinedInput } from "@material-ui/core";

import { StringInputProps } from "types";

const TextInput = ({
  className,
  id,
  value,
  onChange,
  testId,
}: StringInputProps) => (
  <OutlinedInput
    className={className}
    id={id}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    autoComplete="new-password" // disable autocomplete
    inputProps={{ "data-testid": testId }}
    fullWidth
  />
);

export default TextInput;
