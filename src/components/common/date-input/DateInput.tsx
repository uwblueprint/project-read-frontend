import React from "react";

import { Box, InputLabel } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import moment from "moment";

import { InputProps } from "types";

export enum TestId {
  Input = "input",
  KeyboardButton = "keyboard-button",
}

type Props = InputProps & {
  value: string | null;
  onChange: (value: string) => void;
};

const DateInput = ({
  id,
  label,
  value,
  onChange,
  inputWidth,
  testId,
}: Props) => (
  <Box display="flex" flexDirection="row" alignItems="center" marginY={2}>
    <Box paddingRight={2} width={150}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
    </Box>
    <Box width={inputWidth}>
      <KeyboardDatePicker
        id={id}
        autoOk
        disableToolbar
        disableFuture
        variant="dialog"
        inputVariant="outlined"
        format="MM/DD/yyyy"
        value={value === "" ? null : value}
        onChange={(date) =>
          onChange(date ? moment(date).format("YYYY-MM-DD") : "")
        }
        fullWidth
        KeyboardButtonProps={{
          "aria-label": "change date",
          ...{ "data-testid": TestId.KeyboardButton },
        }}
        inputProps={{ "aria-label": testId, "data-testid": TestId.Input }}
      />
    </Box>
  </Box>
);

export default DateInput;
