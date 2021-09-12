import React from "react";

import { Button } from "@material-ui/core";
import { Add } from "@material-ui/icons";

import useStyles from "./styles";

type Props = {
  disabled?: boolean;
  label: string;
  onClick: () => void;
};

const AddButton = ({ disabled = false, label, onClick }: Props) => {
  const classes = useStyles();
  return (
    <Button
      className={classes.button}
      disabled={disabled}
      onClick={onClick}
      size="medium"
      variant="outlined"
    >
      <Add fontSize="small" className={classes.buttonIcon} />
      {label}
    </Button>
  );
};

export default AddButton;
