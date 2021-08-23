import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputBase,
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
  AddCircleOutline,
  Close,
  ExpandMore,
  RemoveCircleOutline,
  SupervisorAccountOutlined,
} from "@material-ui/icons";

import FamilyAPI from "api/FamilyAPI";
import {
  ClassDetailResponse,
  EnrolmentRequest,
  FamilySearchResponse,
  GuestRequest,
  StudentSearchResponse,
} from "api/types";
import ConfirmationDialog from "components/common/confirmation-dialog";
import RoundedOutlinedButton from "components/common/rounded-outlined-button";
import StudentSearchBar from "components/family-search/student-search-bar";
import DefaultFields from "constants/DefaultFields";
import EnrolmentStatus from "constants/EnrolmentStatus";

import useStyles from "./styles";

const NUM_COLUMNS = 6;
let GUEST_COUNTER = 0;

export const generateKey = (): number => {
  const key = GUEST_COUNTER;
  GUEST_COUNTER += 1;
  return key;
};

const getDefaultEnrolmentData = (sessionId: number, classId: number) => ({
  family: null,
  session: sessionId,
  enrolled_class: classId,
  preferred_class: null,
  status: EnrolmentStatus.REGISTERED,
  students: [],
});

type SelectableStudent = StudentSearchResponse & { selected: boolean };

type SelectableFamily = Omit<
  FamilySearchResponse,
  "parent" | "children" | "guests"
> & {
  parent: SelectableStudent;
  children: SelectableStudent[];
  guests: SelectableStudent[];
};

type Props = {
  classObj: ClassDetailResponse;
  open: boolean;
  onClose: () => void;
  //   onSubmit: () => void;
  sessionId: number;
};

const AddGuestDialog = ({
  classObj,
  onClose,
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
  >(getDefaultEnrolmentData(sessionId, classObj.id));
  const [expandedFamilyId, setExpandedFamilyId] = useState<number | null>(null);
  const [guests, setGuests] = useState<(GuestRequest & { index: number })[]>(
    []
  );

  const resetDialog = () => {
    setFirstName("");
    setLastName("");
    setShouldDisplaySearch(false);
    setFamilyResults([]);
    setExpandedFamilyId(null);
    setEnrolment(getDefaultEnrolmentData(sessionId, classObj.id));
    setGuests([]);
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

  // Selecting existing students ==============================================

  const handleSelectStudent = (familyId: number, studentId: number) => {
    if (familyId === enrolment.family) {
      // selected student in currently selected family
      if (enrolment.students.includes(studentId)) {
        // unselect student
        setEnrolment({
          ...enrolment,
          students: enrolment.students.filter((id) => id !== studentId),
        });
      } else {
        // select student
        setEnrolment({
          ...enrolment,
          students: [...enrolment.students, studentId],
        });
      }
    } else {
      // selected student in new family
      setEnrolment({ ...enrolment, family: familyId, students: [studentId] });
    }
  };

  const isNotSelected = (familyId: number) =>
    enrolment.family !== null && enrolment.family !== familyId;

  const getSelectTableCell = (familyId: number, studentId: number) => {
    const isStudentRegistered =
      classObj.families.find(
        (family) =>
          [family.parent]
            .concat(family.children)
            .concat(family.guests)
            .find((student) => student.id === studentId) !== undefined
      ) !== undefined;
    return (
      <TableCell className={classes.densePaddingY}>
        {isStudentRegistered ? (
          <Tooltip
            title={`This student is already registered in ${classObj.name}`}
            aria-label="already registered"
          >
            <span>
              <RoundedOutlinedButton className={classes.selectButton} disabled>
                Select
              </RoundedOutlinedButton>
            </span>
          </Tooltip>
        ) : (
          <RoundedOutlinedButton
            className={classes.selectButton}
            onClick={() => handleSelectStudent(familyId, studentId)}
            disabled={isNotSelected(familyId)}
          >
            {enrolment.students.includes(studentId) ? "Unselect" : "Select"}
          </RoundedOutlinedButton>
        )}
      </TableCell>
    );
  };

  // New guests ===============================================================

  const addGuest = (familyId: number) => {
    setGuests([
      ...guests,
      { first_name: "", last_name: "", index: generateKey() },
    ]);
    setEnrolment({ ...enrolment, family: familyId });
  };

  const updateGuest = (i: number, data: GuestRequest) => {
    const guestsData = [...guests];
    guestsData[i] = { ...guests[i], ...data };
    setGuests([...guestsData]);
  };

  const deleteGuest = (index: number) => {
    setGuests([...guests.filter((guest) => guest.index !== index)]);
  };

  // Setting the selected/expanded family =====================================

  const onClickExpand = (familyId: number) => {
    if (familyId === expandedFamilyId) {
      setExpandedFamilyId(null);
    } else {
      setExpandedFamilyId(familyId);
    }
  };

  useEffect(() => {
    // if all students and guests have been unselected, clear the family
    if (!enrolment.students.length && !guests.length) {
      setEnrolment({ ...enrolment, family: null });
    }
  }, [enrolment.students, guests]);

  useEffect(() => {
    if (enrolment.family !== null) {
      setExpandedFamilyId(enrolment.family);
    }
  }, [enrolment.family]);

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setIsConfirming(true)}
        disableBackdropClick
        fullWidth
        maxWidth="md"
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle disableTypography>
          <Typography variant="h2">Add a client</Typography>
          <IconButton
            aria-label="close"
            onClick={() => setIsConfirming(true)}
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
            disabled={expandedFamilyId !== null}
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
                      <TableCell className={classes.nameColumn}>
                        {DefaultFields.FIRST_NAME.name}
                      </TableCell>
                      <TableCell className={classes.nameColumn}>
                        {DefaultFields.LAST_NAME.name}
                      </TableCell>
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
                                aria-expanded={family.id === expandedFamilyId}
                                aria-label="show students"
                                className={`${classes.expandButton} ${
                                  family.id === expandedFamilyId &&
                                  classes.expandButtonOpen
                                }`}
                                disabled={isNotSelected(family.id)}
                                onClick={() => onClickExpand(family.id)}
                                size="small"
                              >
                                <ExpandMore />
                              </IconButton>
                            </TableCell>
                            <TableCell
                              className={`${classes.nameColumn} ${classes.parentFirstNameTableCell}`}
                            >
                              {family.parent.first_name}
                              <SupervisorAccountOutlined
                                color="action"
                                className={classes.parentIcon}
                              />
                            </TableCell>
                            <TableCell className={classes.nameColumn}>
                              {family.parent.last_name}
                            </TableCell>
                            <TableCell>
                              {family.children.length + family.guests.length}
                            </TableCell>
                            <TableCell className={classes.iconButtonTableCell}>
                              <IconButton
                                aria-label="add guest to family"
                                disabled={isNotSelected(family.id)}
                                onClick={() => addGuest(family.id)}
                                size="small"
                              >
                                <AddCircleOutline />
                              </IconButton>
                            </TableCell>
                            {getSelectTableCell(family.id, family.parent.id)}
                          </TableRow>
                          {family.id === expandedFamilyId && (
                            <>
                              {guests.length > 0 &&
                                guests.map((guest, i) => (
                                  <TableRow
                                    className={classes.studentRow}
                                    key={guest.index}
                                  >
                                    <TableCell />
                                    <TableCell
                                      className={`${classes.nameColumn} ${classes.densePaddingY}`}
                                    >
                                      <InputBase
                                        className={classes.nameInput}
                                        inputProps={{
                                          "aria-label": `guest ${i} first name`,
                                        }}
                                        onChange={(e) =>
                                          updateGuest(i, {
                                            ...guest,
                                            first_name: e.target.value,
                                          })
                                        }
                                        placeholder="First name"
                                        value={guest.first_name}
                                      />
                                    </TableCell>
                                    <TableCell
                                      className={`${classes.nameColumn} ${classes.densePaddingY}`}
                                    >
                                      <InputBase
                                        className={classes.nameInput}
                                        inputProps={{
                                          "aria-label": `guest ${i} last name`,
                                        }}
                                        onChange={(e) =>
                                          updateGuest(i, {
                                            ...guest,
                                            last_name: e.target.value,
                                          })
                                        }
                                        placeholder="Last name"
                                        value={guest.last_name}
                                      />
                                    </TableCell>
                                    <TableCell />
                                    <TableCell
                                      className={classes.iconButtonTableCell}
                                    >
                                      <IconButton
                                        aria-label="delete guest"
                                        size="small"
                                        onClick={() => deleteGuest(guest.index)}
                                      >
                                        <RemoveCircleOutline />
                                      </IconButton>
                                    </TableCell>
                                    <TableCell
                                      className={classes.densePaddingY}
                                    >
                                      <RoundedOutlinedButton
                                        className={classes.selectButton}
                                        disabled
                                      >
                                        Unselect
                                      </RoundedOutlinedButton>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              {family.children
                                .concat(family.guests)
                                .map((student) => (
                                  <TableRow
                                    key={student.id}
                                    className={classes.studentRow}
                                  >
                                    <TableCell />
                                    <TableCell className={classes.nameColumn}>
                                      {student.first_name}
                                    </TableCell>
                                    <TableCell className={classes.nameColumn}>
                                      {student.last_name}
                                    </TableCell>
                                    <TableCell />
                                    <TableCell />
                                    {getSelectTableCell(family.id, student.id)}
                                  </TableRow>
                                ))}
                            </>
                          )}
                        </>
                      ))}
                    </TableBody>
                  ) : (
                    <TableFooter>
                      <TableRow>
                        <TableCell
                          colSpan={NUM_COLUMNS}
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
          onClose();
        }}
        open={isConfirming}
        title={`Are you sure you want to go back to ${classObj.name} attendance?`}
      />
    </>
  );
};

export default AddGuestDialog;
