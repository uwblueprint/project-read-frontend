import React from "react";

import { Theme } from "@material-ui/core";
import { CalendarToday } from "@material-ui/icons";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/styles";
import moment from "moment";

export enum TestId {
  Input = "input",
  KeyboardButton = "keyboard-button",
}

const denseStyles = (theme: Theme) => ({
  button: {
    height: 16,
    width: 16,
  },
  datePicker: {
    backgroundColor: theme.palette.background.paper,
  },
  input: {
    fontSize: 14,
    height: 32,
    paddingBottom: 0,
    paddingTop: 0,
  },
});

const useStyles = makeStyles<Theme, Pick<Props, "dense">>((theme) => ({
  button: ({ dense }) => (dense ? denseStyles(theme).button : {}),
  datePicker: ({ dense }) => (dense ? denseStyles(theme).datePicker : {}),
  input: ({ dense }) => (dense ? denseStyles(theme).input : {}),
}));

type Props = {
  dense?: boolean;
  disableFuture?: boolean;
  id: string;
  onChange: (value: Date | null) => void;
  placeholder?: string;
  testId?: string;
  value: Date | null;
};

const defaultProps = {
  dense: false,
  disableFuture: false,
  placeholder: "",
  testId: "",
};

const DateInput = ({
  dense,
  disableFuture,
  id,
  onChange,
  placeholder,
  testId,
  value,
}: Props) => {
  const classes = useStyles({ dense });
  return (
    <KeyboardDatePicker
      autoOk
      className={classes.datePicker}
      disableFuture={disableFuture}
      disableToolbar
      format="MM/DD/yyyy"
      fullWidth
      id={id}
      inputProps={{
        "aria-label": testId,
        className: classes.input,
        "data-testid": TestId.Input,
      }}
      inputVariant="outlined"
      KeyboardButtonProps={{
        className: classes.button,
        "aria-label": "change date",
        ...{ "data-testid": TestId.KeyboardButton },
      }}
      keyboardIcon={<CalendarToday className={classes.button} />}
      onChange={(date) =>
        onChange(date ? moment(date, "MM/DD/yyyy").toDate() : null)
      }
      placeholder={placeholder || "MM/DD/YYYY"}
      value={value}
      variant="inline"
    />
  );
};

DateInput.defaultProps = defaultProps;

export default DateInput;
