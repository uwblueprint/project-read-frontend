import React, { useState } from "react";

import { Button, Box, TextField, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Search } from "@material-ui/icons";

import DefaultFields from "constants/DefaultFields";

const useStyles = makeStyles((theme) => ({
  button: {
    height: 55,
    minWidth: 55,
  },
  input: {
    marginRight: theme.spacing(2),
    width: 328,
  },
}));

type Props = {
  disabled?: boolean;
  disabledMessage?: string;
  firstName: string;
  lastName: string;
  onChangeFirstName: (name: string) => void;
  onChangeLastName: (name: string) => void;
  onSubmit: () => void;
};

const StudentSearchBar = ({
  disabled = false,
  disabledMessage = "",
  firstName,
  lastName,
  onChangeFirstName,
  onChangeLastName,
  onSubmit,
}: Props) => {
  const classes = useStyles();
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isError = firstName === "" && lastName === "";
    setHasError(isError);
    if (!isError) {
      onSubmit();
    }
  };

  return (
    <Box marginY={2}>
      <form onSubmit={handleSubmit} autoComplete="off">
        <TextField
          id={DefaultFields.FIRST_NAME.id}
          className={classes.input}
          error={hasError}
          helperText={hasError && "Please enter a value"}
          variant="outlined"
          placeholder={DefaultFields.FIRST_NAME.name}
          value={firstName}
          onChange={(e) => onChangeFirstName(e.target.value)}
        />
        <TextField
          id={DefaultFields.LAST_NAME.id}
          className={classes.input}
          error={hasError}
          variant="outlined"
          placeholder={DefaultFields.LAST_NAME.name}
          value={lastName}
          onChange={(e) => onChangeLastName(e.target.value)}
        />
        <Tooltip
          aria-label={disabled ? disabledMessage : ""}
          title={disabled ? disabledMessage : ""}
        >
          <span>
            <Button
              type="submit"
              aria-label="search"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={disabled}
            >
              <Search />
            </Button>
          </span>
        </Tooltip>
      </form>
    </Box>
  );
};

export default StudentSearchBar;
