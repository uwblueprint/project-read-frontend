import React, { useState } from "react";
import {
  Box,
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
import FamilyAPI, {
  FamilySearchResponse,
  FamilyStudentRequest,
} from "../../api/FamilyAPI";
import FamilySearchResultsTable from "../family-search/family-search-results-table";
import StudentSearchBar from "../family-search/student-search-bar";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  dialogHeading: {
    marginBottom: 8,
  },
  dialogTitle: {
    marginBottom: 16,
  },
  registerButton: {
    borderRadius: 18,
    paddingLeft: 24,
    paddingRight: 24,
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
  const [displaySearch, setDisplaySearch] = useState(true);
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayResults, setDisplayResults] = useState(false);
  const [familyResults, setFamilyResults] = useState<FamilySearchResponse[]>(
    []
  );

  const handleDisplayForm = () => {
    setDisplayForm(true);
    setDisplaySearch(false);
  };

  const handleHideForm = () => {
    setDisplayForm(false);
    setDisplaySearch(true);
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

  const onSearchSubmit = async () => {
    setDisplayResults(true);
    setFamilyResults(
      await FamilyAPI.searchFamiliesByParent(firstName, lastName)
    );
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
        <Typography variant="h2" className={classes.dialogTitle}>
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

      <DialogContent style={{ minHeight: "500px" }}>
        {displaySearch && (
          <>
            <Typography variant="h3" className={classes.dialogHeading}>
              Search for a client
            </Typography>
            <Box marginBottom={3}>
              <Typography variant="body1">
                Make sure the client being registered isn’t already enrolled.
              </Typography>
              <StudentSearchBar
                firstName={firstName}
                lastName={lastName}
                onChangeFirstName={setFirstName}
                onChangeLastName={setLastName}
                onSubmit={onSearchSubmit}
              />
            </Box>
            {displayResults && (
              <Box marginBottom={1}>
                <Typography variant="h4">Search results</Typography>
                <FamilySearchResultsTable families={familyResults} />
                <Typography variant="h4">Not found?</Typography>
              </Box>
            )}
            <Button
              onClick={handleDisplayForm}
              variant="outlined"
              className={classes.registerButton}
            >
              Register a new client
            </Button>
          </>
        )}
        {displayForm && (
          <>
            <Button onClick={handleHideForm}>
              <NavigateBefore />
              Go back
            </Button>
            <RegistrationForm onSubmit={onFormSubmit} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationFormDialog;
