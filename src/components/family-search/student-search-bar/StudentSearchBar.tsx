import React, { useState } from "react";
import { Button, Box, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Search } from "@material-ui/icons";

const useStyles = makeStyles(() => ({
  button: {
    boxShadow: "none",
    height: 55,
    minWidth: 55,
  },
  input: {
    marginRight: 16,
  },
}));

type Props = {
  firstName: string;
  lastName: string;
  onChangeFirstName: (name: string) => void;
  onChangeLastName: (name: string) => void;
  onSubmit: () => void;
};

const StudentSearchBar = ({
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
      <form onSubmit={handleSubmit}>
        <TextField
          className={classes.input}
          error={hasError}
          helperText={hasError && "Please enter a value"}
          variant="outlined"
          placeholder="First name"
          value={firstName}
          onChange={(e) => onChangeFirstName(e.target.value)}
        />
        <TextField
          className={classes.input}
          error={hasError}
          variant="outlined"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => onChangeLastName(e.target.value)}
        />
        <Button
          type="submit"
          aria-label="search"
          variant="contained"
          color="primary"
          className={classes.button}
        >
          <Search />
        </Button>
      </form>
    </Box>
  );
};

export default StudentSearchBar;
