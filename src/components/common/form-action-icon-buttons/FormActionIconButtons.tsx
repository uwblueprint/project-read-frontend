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
        size="small"
        className={classes.formActionButton}
        onClick={onDelete}
      >
        <DeleteOutline />
      </IconButton>
      <IconButton
        size="small"
        className={classes.formActionButton}
        onClick={onSubmit}
      >
        <Check />
      </IconButton>
    </>
  );
};

export default FormActionIconButtons;
