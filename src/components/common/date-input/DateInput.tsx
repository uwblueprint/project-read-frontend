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
  value: Date;
  onChange: (value: Date) => void;
};

const DateInput = ({ id, label, value, onChange, inputWidth }: Props) => (
  <Box display="flex" flexDirection="row" alignItems="center" marginY={2}>
    <Box paddingRight={2} width={150}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
    </Box>
    <Box width={inputWidth}>
      <KeyboardDatePicker
        id={id}
        autoOk
        disableToolbar
        variant="inline"
        inputVariant="outlined"
        format="MM/DD/yyyy"
        value={value}
        onChange={(date) => onChange(moment(date).toDate())}
        KeyboardButtonProps={{
          "aria-label": "change date",
          ...{ "data-testid": TestId.KeyboardButton },
        }}
        inputProps={{ "data-testid": TestId.Input }}
        fullWidth
      />
    </Box>
  </Box>
);

export default DateInput;
