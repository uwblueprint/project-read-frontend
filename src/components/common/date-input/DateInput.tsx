import React from "react";

import { KeyboardDatePicker } from "@material-ui/pickers";
import moment from "moment";

export enum TestId {
  Input = "input",
  KeyboardButton = "keyboard-button",
}

type Props = {
  id: string;
  onChange: (value: Date | null) => void;
  placeholder?: string;
  testId?: string;
  value: Date | null;
};

const defaultProps = {
  placeholder: "",
  testId: "",
};

const DateInput = ({ id, onChange, placeholder, testId, value }: Props) => (
  <KeyboardDatePicker
    autoOk
    disableFuture
    disableToolbar
    format="MM/DD/yyyy"
    fullWidth
    id={id}
    inputProps={{ "aria-label": testId, "data-testid": TestId.Input }}
    inputVariant="outlined"
    KeyboardButtonProps={{
      "aria-label": "change date",
      ...{ "data-testid": TestId.KeyboardButton },
    }}
    onChange={(date) =>
      onChange(date ? moment(date, "MM/DD/yyyy").toDate() : null)
    }
    placeholder={placeholder}
    value={value}
    variant="dialog"
  />
);

DateInput.defaultProps = defaultProps;

export default DateInput;
