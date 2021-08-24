import React from "react";

import { IconButton, Tooltip } from "@material-ui/core";
import { Check, DeleteOutline } from "@material-ui/icons";

import useStyles from "./styles";

type Props = {
  errorMessage?: string;
  onDelete: () => void;
  onSubmit: () => void;
};

const FormActionIconButtons = ({
  errorMessage = "",
  onDelete,
  onSubmit,
}: Props) => {
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
      <Tooltip aria-label={errorMessage} title={errorMessage}>
        <span>
          <IconButton
            aria-label="save"
            className={classes.formActionButton}
            disabled={errorMessage.length > 0}
            onClick={onSubmit}
            size="small"
          >
            <Check />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};

export default FormActionIconButtons;
