import React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

import useStyles from "./styles";

const BASE_NAME = "confirmation-dialog";

type Props = {
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  title: string;
};

const ConfirmationDialog = ({
  description,
  onCancel,
  onConfirm,
  open,
  title,
}: Props) => {
  const classes = useStyles();
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby={`${BASE_NAME}-title`}
      aria-describedby={`${BASE_NAME}-description`}
      PaperProps={{ className: classes.dialog }}
    >
      <DialogTitle id={`${BASE_NAME}-title`} className={classes.title}>
        {title}
      </DialogTitle>
      <DialogContent className={classes.content}>
        <DialogContentText id={`${BASE_NAME}-description`}>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} color="default" variant="contained">
          Leave this page
        </Button>
        <Button
          onClick={onCancel}
          color="primary"
          variant="contained"
          autoFocus
        >
          Stay on this page
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
