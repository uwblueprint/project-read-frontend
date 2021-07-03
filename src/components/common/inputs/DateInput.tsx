import React from "react";

import { Box, InputLabel } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import moment from "moment";

import { InputProps } from "types";

type Props = InputProps & {
  value: string;
  onChange: (value: string) => void;
};

const DateInput = ({ id, label, value, onChange, inputWidth }: Props) => (
  <Box display="flex" flexDirection="row" alignItems="center" marginY={2}>
    <Box paddingRight={2} width={150}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
    </Box>
    <Box width={inputWidth}>
      <DatePicker
        id={id}
        autoOk
        disableToolbar
        variant="inline"
        inputVariant="outlined"
        format="MMMM D, yyyy"
        value={value}
        onChange={(date) => onChange(moment(date).format("YYYY-MM-DD"))}
        fullWidth
      />
    </Box>
  </Box>
);

export default DateInput;
