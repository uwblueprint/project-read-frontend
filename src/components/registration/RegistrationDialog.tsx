import React, { useEffect, useState } from "react";

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

import FamilyAPI from "api/FamilyAPI";
import {
  FamilySearchResponse,
  FamilyStudentRequest,
  SessionDetailResponse,
} from "api/types";

import FamilySearchResultsTable from "../family-search/family-search-results-table";
import StudentSearchBar from "../family-search/student-search-bar";
import RegistrationForm from "./registration-form";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  dialogHeading: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  dialogPaper: {
    height: 750,
  },
  dialogSubheading: {
    marginTop: theme.spacing(3),
  },
  registerButton: {
    borderRadius: 18,
    marginTop: theme.spacing(2),
    paddingLeft: 24,
    paddingRight: 24,
  },
}));

type Props = {
  open: boolean;
  onClose: () => void;
  session: SessionDetailResponse;
};

const RegistrationDialog = ({ open, onClose, session }: Props) => {
  const classes = useStyles();
  const [shouldDisplaySearch, setShouldDisplaySearch] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [familyResults, setFamilyResults] = useState<FamilySearchResponse[]>(
    []
  );
  const [shouldDisplayFamilyResults, setShouldDisplayFamilyResults] = useState(
    false
  );

  const resetSearch = () => {
    setFirstName("");
    setLastName("");
    setShouldDisplayFamilyResults(false);
    setFamilyResults([]);
  };

  useEffect(() => {
    resetSearch();
  }, [open, shouldDisplaySearch]);

  const onSearchSubmit = async () => {
    setShouldDisplayFamilyResults(true);
    setFamilyResults(
      await FamilyAPI.getFamiliesByParentName(firstName, lastName)
    );
  };

  const onRegistrationFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    data: FamilyStudentRequest
  ) => {
    e.preventDefault();
    const response = await FamilyAPI.postFamily(data);
    if (response.non_field_errors) {
      // eslint-disable-next-line no-alert
      alert(response.non_field_errors);
      return;
    }
    setShouldDisplaySearch(true);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableBackdropClick
      fullWidth
      maxWidth="md"
      classes={{ paper: classes.dialogPaper }}
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
        {shouldDisplaySearch ? (
          <>
            <Typography variant="h3" className={classes.dialogHeading}>
              Search for a client
            </Typography>
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
            {shouldDisplayFamilyResults && (
              <>
                <Typography variant="h4" className={classes.dialogSubheading}>
                  Search results
                </Typography>
                <FamilySearchResultsTable families={familyResults} />
                <Typography variant="h4" className={classes.dialogSubheading}>
                  Not found?
                </Typography>
              </>
            )}
            <Button
              onClick={() => setShouldDisplaySearch(false)}
              variant="outlined"
              className={classes.registerButton}
            >
              Register a new client
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setShouldDisplaySearch(true)}>
              <NavigateBefore />
              Go back
            </Button>
            <RegistrationForm
              onSubmit={onRegistrationFormSubmit}
              session={session}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationDialog;
