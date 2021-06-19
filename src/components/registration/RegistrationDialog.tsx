import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Close, NavigateBefore } from "@material-ui/icons";
import RegistrationForm from "./RegistrationForm";
import FamilyAPI, { FamilyStudentRequest } from "../../api/FamilyAPI";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

type RegistrationFormDialogProps = {
  open: boolean;
  onClose: () => void;
};

const RegistrationFormDialog = ({
  open,
  onClose,
}: RegistrationFormDialogProps) => {
  const classes = useStyles();
  const [displayForm, setDisplayForm] = useState(false);

  const handleDisplayForm = () => {
    setDisplayForm(true);
  };

  const handleHideForm = () => {
    setDisplayForm(false);
  };

  const onFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    data: FamilyStudentRequest
  ) => {
    e.preventDefault();
    const response = await FamilyAPI.postFamily(data);
    if (response.non_field_errors) {
      // eslint-disable-next-line no-alert
      alert(response.non_field_errors);
    } else {
      handleHideForm();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableBackdropClick
      fullWidth
      maxWidth="md"
    >
      <DialogTitle disableTypography>
        <Typography variant="h2">Add a client</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          className={classes.closeButton}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {displayForm ? (
          <>
            <Button onClick={handleHideForm}>
              <NavigateBefore />
              Go back
            </Button>
            <RegistrationForm onSubmit={onFormSubmit} />
          </>
        ) : (
          <Button onClick={handleDisplayForm}>Register a new client</Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationFormDialog;
