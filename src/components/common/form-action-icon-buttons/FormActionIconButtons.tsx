import React from "react";

import { IconButton } from "@material-ui/core";
import { Check, DeleteOutline } from "@material-ui/icons";

import useStyles from "./styles";

type Props = {
  onDelete: () => void;
  onSubmit: () => void;
};

const FormActionIconButtons = ({ onDelete, onSubmit }: Props) => {
  const classes = useStyles();
  return (
    <>
      <IconButton
        aria-label="delete"
        className={classes.formActionButton}
        onClick={onDelete}
        size="small"
      >
        <DeleteOutline />
      </IconButton>
      <IconButton
        aria-label="save"
        className={classes.formActionButton}
        onClick={onSubmit}
        size="small"
      >
        <Check />
      </IconButton>
    </>
  );
};

export default FormActionIconButtons;
