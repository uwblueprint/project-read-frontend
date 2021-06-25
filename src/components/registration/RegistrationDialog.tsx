import React, { useState } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TableContainer,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Close, Search, NavigateBefore } from "@material-ui/icons";
import RegistrationForm from "./RegistrationForm";
import FamilyAPI, { FamilyStudentRequest } from "../../api/FamilyAPI";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  searchSection: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  searchButton: {
    height: theme.spacing(5),
    width: theme.spacing(4),
    margin: "8px",
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
  const [validInput, setValidInput] = useState(true);
  const [displayResults, setDisplayResults] = useState(false);

  const [familyResponse, setFamilyResponse] = useState<any[]>([]);

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
    if (firstName || lastName) {
      setDisplayResults(true);
      setValidInput(true);
      setFamilyResponse(await FamilyAPI.getFamilySearch(firstName, lastName));
    } else {
      setDisplayResults(false);
      setValidInput(false);
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

      <DialogContent style={{ minHeight: "500px" }}>
        {displaySearch ? (
          <>
            <Typography component="h2" variant="h6">
              Search for a client
            </Typography>
            <Typography component="h1" variant="body1">
              Make sure the client being registered isn’t already enrolled.
            </Typography>
            <Box>
              <TextField // should these be FormFieldGroup components? Add feature to "wipe" user-entered when dialog closes so that each opening is a clean slate
                error={!validInput}
                helperText={validInput ? null : "Please enter a value"}
                variant="outlined"
                margin="dense"
                placeholder="First name"
                style={{ marginRight: "10px" }}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                error={!validInput}
                variant="outlined"
                margin="dense"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <Button
                aria-label="search"
                variant="contained"
                color="primary"
                onClick={onSearchSubmit}
                className={classes.searchButton}
              >
                <Search />
              </Button>
            </Box>
            {displayResults ? (
              <Box className={classes.searchSection}>
                <Typography component="h1" variant="body1">
                  Search Results
                </Typography>
                <TableContainer style={{ maxHeight: "350px" }}>
                  <Table stickyHeader aria-label="sticky results table">
                    <TableHead>
                      <TableRow>
                        <TableCell>First Name</TableCell>
                        <TableCell>Last Name</TableCell>
                        <TableCell>Primary Phone Number</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell># of Children</TableCell>
                      </TableRow>
                    </TableHead>
                    {familyResponse.length ? (
                      <TableBody>
                        {familyResponse.map((family) => (
                          <TableRow>
                            <TableCell>{family.first_name}</TableCell>
                            <TableCell>{family.last_name}</TableCell>
                            <TableCell>{family.phone_number}</TableCell>
                            <TableCell>{family.email}</TableCell>
                            <TableCell>{family.num_children}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    ) : (
                      <TableFooter>
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            style={{ textAlign: "center" }}
                          >
                            No Results Found
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    )}
                  </Table>
                </TableContainer>
                <Typography
                  component="h1"
                  variant="body1"
                  className={classes.searchSection}
                >
                  Not found?
                </Typography>
              </Box>
            ) : null}
          </>
        ) : null}
        {displayForm ? (
          <>
            <Button onClick={handleHideForm}>
              <NavigateBefore />
              Go back
            </Button>
            <RegistrationForm onSubmit={onFormSubmit} />
          </>
        ) : (
          <Button
            onClick={handleDisplayForm}
            variant="outlined"
            style={{ borderRadius: "50px" }}
          >
            Register a new client
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationFormDialog;
