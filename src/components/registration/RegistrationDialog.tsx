import React, { useEffect, useState } from "react";

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

import FamilyAPI from "api/FamilyAPI";
import {
  FamilyDetailResponse,
  FamilySearchResponse,
  SessionDetailResponse,
} from "api/types";
import RoundedOutlinedButton from "components/common/rounded-outlined-button";
import FamilySearchResultsTable from "components/family-search/family-search-results-table";
import StudentSearchBar from "components/family-search/student-search-bar";

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
  const [
    selectedFamily,
    setSelectedFamily,
  ] = useState<FamilyDetailResponse | null>(null);

  const resetDialog = () => {
    setFirstName("");
    setLastName("");
    setShouldDisplayFamilyResults(false);
    setFamilyResults([]);
    setSelectedFamily(null);
    setShouldDisplaySearch(true);
  };

  useEffect(() => {
    resetDialog();
  }, [open]);

  const onSubmitSearch = async () => {
    setShouldDisplayFamilyResults(true);
    setFamilyResults(
      await FamilyAPI.getFamiliesByParentName(firstName, lastName)
    );
  };

  const onSelectFamily = async (id: number) => {
    setSelectedFamily(await FamilyAPI.getFamilyById(id));
    setShouldDisplaySearch(false);
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
              onSubmit={onSubmitSearch}
            />
            {shouldDisplayFamilyResults && (
              <>
                <Typography variant="h4" className={classes.dialogSubheading}>
                  Search results
                </Typography>
                <FamilySearchResultsTable
                  families={familyResults}
                  onSelectFamily={onSelectFamily}
                />
                <Typography variant="h4" className={classes.dialogSubheading}>
                  Not found?
                </Typography>
              </>
            )}
            <Box marginTop={2}>
              <RoundedOutlinedButton
                onClick={() => setShouldDisplaySearch(false)}
              >
                Register a new client
              </RoundedOutlinedButton>
            </Box>
          </>
        ) : (
          <>
            <Button onClick={resetDialog}>
              <NavigateBefore />
              Go back
            </Button>
            <RegistrationForm
              existingFamily={selectedFamily}
              onSubmit={resetDialog}
              session={session}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationDialog;
