import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core";
import {
  Add,
  Close,
  ExpandMore,
  SupervisorAccountOutlined,
} from "@material-ui/icons";

import FamilyAPI from "api/FamilyAPI";
import {
  ClassDetailResponse,
  EnrolmentRequest,
  FamilySearchResponse,
  StudentSearchResponse,
} from "api/types";
import ConfirmationDialog from "components/common/confirmation-dialog";
import RoundedOutlinedButton from "components/common/rounded-outlined-button";
import StudentSearchBar from "components/family-search/student-search-bar";
import DefaultFields from "constants/DefaultFields";
import EnrolmentStatus from "constants/EnrolmentStatus";

import useStyles from "./styles";

type SelectableStudent = StudentSearchResponse & { selected: boolean };

type SelectableFamily = Omit<
  FamilySearchResponse,
  "parent" | "children" | "guests"
> & {
  parent: SelectableStudent;
  children: SelectableStudent[];
  guests: SelectableStudent[];
  expanded: boolean;
};

type Props = {
  classObj: ClassDetailResponse;
  open: boolean;
  //   onClose: () => void;
  //   onSubmit: () => void;
  sessionId: number;
};

const AddGuestDialog = ({
  classObj,
  open,
  sessionId,
}: //   onSubmit,
//   onClose,
//   onSelectFamily,
Props) => {
  const classes = useStyles();
  const [shouldDisplaySearch, setShouldDisplaySearch] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [familyResults, setFamilyResults] = useState<SelectableFamily[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [enrolment, setEnrolment] = useState<
    Omit<EnrolmentRequest, "family" | "id"> & { family: number | null }
  >({
    family: null,
    session: sessionId,
    enrolled_class: classObj.id,
    preferred_class: null,
    status: EnrolmentStatus.REGISTERED,
    students: [],
  });

  const resetDialog = () => {
    setFirstName("");
    setLastName("");
    setShouldDisplaySearch(true);
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
    setFamilyResults(
      await (await FamilyAPI.getFamiliesByParentName(firstName, lastName)).map(
        (family) => ({
          ...family,
          parent: { ...family.parent, selected: false },
          children: [
            ...family.children.map((child) => ({ ...child, selected: false })),
          ],
          guests: [
            ...family.guests.map((guest) => ({ ...guest, selected: false })),
          ],
          expanded: false,
        })
      )
    );
    setShouldDisplaySearch(true);
  };

  const handleSelectStudent = (familyId: number, studentId: number) => {
    if (familyId === enrolment.family) {
      // the family is already selected
      if (enrolment.students.includes(studentId)) {
        // unselect student
        setEnrolment({
          ...enrolment,
          students: enrolment.students.filter((id) => id !== studentId),
        });
      } else {
        setEnrolment({
          ...enrolment,
          students: [...enrolment.students, studentId],
        });
      }
    } else {
      setEnrolment({ ...enrolment, family: familyId, students: [studentId] });
    }
  };

  useEffect(() => {
    // if all students have been unselected, clear the family
    if (!enrolment.students.length) {
      setEnrolment({ ...enrolment, family: null });
    }
  }, [enrolment.students]);

  const handleClose = () => {
    setIsConfirming(true);
  };

  const isStudentRegistered = (id: number): boolean =>
    classObj.families.find(
      (family) =>
        [family.parent]
          .concat(family.children)
          .concat(family.guests)
          .find((student) => student.id === id) !== undefined
    ) !== undefined;

  const onClickExpand = (id: number) => {
    const families = [...familyResults];
    const index = families.findIndex((family) => family.id === id);
    families[index].expanded = !families[index].expanded;
    setFamilyResults(families);
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
          <Typography variant="h3" className={classes.dialogHeading}>
            Search for a client
          </Typography>
          <Typography variant="body1">
            Choose a guest from the existing enrollment list or select a client
            to add a new guest to.
          </Typography>
          <StudentSearchBar
            disabled={enrolment.family !== null}
            firstName={firstName}
            lastName={lastName}
            onChangeFirstName={setFirstName}
            onChangeLastName={setLastName}
            onSubmit={onSubmitSearch}
          />
          {shouldDisplaySearch && (
            <>
              <Typography variant="h4" className={classes.dialogSubheading}>
                Search results
              </Typography>
              <TableContainer
                component={Paper}
                elevation={0}
                className={classes.tableContainer}
              >
                <Table stickyHeader aria-label="family search results table">
                  <caption hidden>Family search results</caption>
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>{DefaultFields.FIRST_NAME.name}</TableCell>
                      <TableCell>{DefaultFields.LAST_NAME.name}</TableCell>
                      <TableCell>Additional members</TableCell>
                      <TableCell />
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  {familyResults.length > 0 ? (
                    <TableBody>
                      {familyResults.map((family) => (
                        <>
                          <TableRow key={family.id}>
                            <TableCell className={classes.iconButtonTableCell}>
                              <IconButton
                                aria-expanded={family.expanded}
                                aria-label="show students"
                                className={`${classes.expandButton} ${
                                  family.expanded && classes.expandButtonOpen
                                }`}
                                onClick={() => onClickExpand(family.id)}
                                size="small"
                              >
                                <ExpandMore />
                              </IconButton>
                            </TableCell>
                            <TableCell
                              className={classes.parentFirstNameTableCell}
                            >
                              {family.parent.first_name}
                              <SupervisorAccountOutlined
                                color="action"
                                className={classes.parentIcon}
                              />
                            </TableCell>
                            <TableCell>{family.parent.last_name}</TableCell>
                            <TableCell>
                              {family.children.length + family.guests.length}
                            </TableCell>
                            <TableCell className={classes.iconButtonTableCell}>
                              <IconButton
                                aria-label="add guest to family"
                                size="small"
                              >
                                <Add />
                              </IconButton>
                            </TableCell>
                            <TableCell
                              className={classes.selectButtonTableCell}
                            >
                              {isStudentRegistered(family.parent.id) ? (
                                <Tooltip
                                  title={`This student is already registered in ${classObj.name}`}
                                  aria-label="already registered"
                                >
                                  <span>
                                    <RoundedOutlinedButton disabled>
                                      Select
                                    </RoundedOutlinedButton>
                                  </span>
                                </Tooltip>
                              ) : (
                                <RoundedOutlinedButton
                                  onClick={() =>
                                    handleSelectStudent(
                                      family.id,
                                      family.parent.id
                                    )
                                  }
                                  disabled={
                                    enrolment.family !== null &&
                                    enrolment.family !== family.id
                                  }
                                >
                                  {enrolment.students.includes(family.parent.id)
                                    ? "Unselect"
                                    : "Select"}
                                </RoundedOutlinedButton>
                              )}
                            </TableCell>
                          </TableRow>
                          {family.expanded &&
                            family.children
                              .concat(family.guests)
                              .map((student) => (
                                <TableRow
                                  key={student.id}
                                  className={classes.studentRow}
                                >
                                  <TableCell />
                                  <TableCell>{student.first_name}</TableCell>
                                  <TableCell>{student.last_name}</TableCell>
                                  <TableCell />
                                  <TableCell />
                                  <TableCell
                                    className={classes.selectButtonTableCell}
                                  >
                                    {isStudentRegistered(student.id) ? (
                                      <Tooltip
                                        title={`This student is already registered in ${classObj.name}`}
                                        aria-label="already registered"
                                      >
                                        <span>
                                          <RoundedOutlinedButton disabled>
                                            Select
                                          </RoundedOutlinedButton>
                                        </span>
                                      </Tooltip>
                                    ) : (
                                      <RoundedOutlinedButton
                                        onClick={() =>
                                          handleSelectStudent(
                                            family.id,
                                            student.id
                                          )
                                        }
                                        disabled={
                                          enrolment.family !== null &&
                                          enrolment.family !== family.id
                                        }
                                      >
                                        {enrolment.students.includes(student.id)
                                          ? "Unselect"
                                          : "Select"}
                                      </RoundedOutlinedButton>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                        </>
                      ))}
                    </TableBody>
                  ) : (
                    <TableFooter>
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className={classes.noResultsTableCell}
                        >
                          No results found
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  )}
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmationDialog
        description="This information will not be saved."
        onCancel={() => {
          setIsConfirming(false);
        }}
        onConfirm={() => {
          setIsConfirming(false);
          //   onClose();
        }}
        open={isConfirming}
        title="Are you sure you want to go back to Sessions?"
      />
    </>
  );
};

export default AddGuestDialog;
