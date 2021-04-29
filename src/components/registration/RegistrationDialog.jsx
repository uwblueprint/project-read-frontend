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
import PropTypes from "prop-types";
import RegistrationForm from "./RegistrationForm";
import FamilyAPI from "../../api/FamilyAPI";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

function RegistrationFormDialog({ open, onClose }) {
  const classes = useStyles();
  const [displayForm, setDisplayForm] = useState(false);

  const handleDisplayForm = () => {
    setDisplayForm(true);
  };

  const handleHideForm = () => {
    setDisplayForm(false);
  };

  async function onFormSubmit(data) {
    const response = await FamilyAPI.postFamily(data);
    if (response.non_field_errors) {
      // eslint-disable-next-line no-alert
      alert(response.non_field_errors);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableBackdropClick
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle disableTypography>
        <Typography component="h2" variant="h4">
          Add a client
        </Typography>
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
}

RegistrationFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RegistrationFormDialog;
