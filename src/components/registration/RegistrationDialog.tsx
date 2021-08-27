import React, { ReactNode, useEffect, useState } from "react";

import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";

import FamilyAPI from "api/FamilyAPI";
import { FamilySearchResponse, SessionDetailResponse } from "api/types";
import ConfirmationDialog from "components/common/confirmation-dialog";
import RoundedOutlinedButton from "components/common/rounded-outlined-button";
import FamilySearchResultsTable from "components/family-search/family-search-results-table";
import StudentSearchBar from "components/family-search/student-search-bar";

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
  onSelectFamily: (id: number | null) => void;
  registrationForm: ReactNode;
  session: SessionDetailResponse;
};

const RegistrationDialog = ({
  open,
  onClose,
  onSelectFamily,
  registrationForm,
  session,
}: Props) => {
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
  const [isConfirming, setIsConfirming] = useState(false);

  const resetDialog = () => {
    setFirstName("");
    setLastName("");
    setShouldDisplaySearch(true);
    setShouldDisplayFamilyResults(false);
    setFamilyResults([]);
  };

  useEffect(() => {
    if (open) {
      window.onbeforeunload = () => true;
      resetDialog();
    } else {
      window.onbeforeunload = null;
    }
  }, [open]);

  const onSubmitSearch = async () => {
    setShouldDisplayFamilyResults(true);
    setFamilyResults(
      await FamilyAPI.getFamiliesByParentName(firstName, lastName)
    );
  };

  const handleSelectFamily = (id: number | null) => {
    setShouldDisplaySearch(false);
    onSelectFamily(id);
  };

  const handleClose = () => {
    setIsConfirming(true);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        disableBackdropClick
        fullWidth
        maxWidth="md"
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle disableTypography>
          <Typography variant="h2">Add a client</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
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
                    onSelectFamily={handleSelectFamily}
                    session={session}
                  />
                  <Typography variant="h4" className={classes.dialogSubheading}>
                    Not found?
                  </Typography>
                </>
              )}
              <Box marginTop={2}>
                <RoundedOutlinedButton onClick={() => handleSelectFamily(null)}>
                  Register a new client
                </RoundedOutlinedButton>
              </Box>
            </>
          ) : (
            <>{registrationForm}</>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmationDialog
        cancelButtonLabel="Stay on this page"
        confirmButtonLabel="Leave this page"
        description="This information will not be saved."
        onCancel={() => {
          setIsConfirming(false);
        }}
        onConfirm={() => {
          setIsConfirming(false);
          onClose();
        }}
        open={isConfirming}
        title="Are you sure you want to go back to Sessions?"
      />
    </>
  );
};

export default RegistrationDialog;
