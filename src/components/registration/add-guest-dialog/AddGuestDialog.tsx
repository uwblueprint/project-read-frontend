import React, { useEffect, useState } from "react";

import {
  Button,
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

import EnrolmentAPI, { enrolmentResponseToRequest } from "api/EnrolmentAPI";
import FamilyAPI from "api/FamilyAPI";
import {
  ClassDetailResponse,
  EnrolmentRequest,
  FamilySearchResponse,
  StudentListRequest,
  StudentListResponse,
} from "api/types";
import ConfirmationDialog from "components/common/confirmation-dialog";
import RoundedOutlinedButton from "components/common/rounded-outlined-button";
import SpinnerOverlay from "components/common/spinner-overlay";
import StudentSearchBar from "components/family-search/student-search-bar";
import DefaultFields from "constants/DefaultFields";
import EnrolmentStatus from "constants/EnrolmentStatus";
import StudentRole from "constants/StudentRole";

import useStyles from "./styles";

const NUM_COLUMNS = 6;
let GUEST_COUNTER = 0;

export const generateKey = (): number => {
  const key = GUEST_COUNTER;
  GUEST_COUNTER += 1;
  return key;
};

const getDefaultGuestEnrolmentData = (sessionId: number, classId: number) => ({
  family: null,
  session: sessionId,
  enrolled_class: classId,
  preferred_class: null,
  status: EnrolmentStatus.REGISTERED,
  students: [],
  is_guest: true,
});

type SelectableStudent = StudentListResponse & { selected: boolean };

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
  onSubmit: () => void;
  sessionId: number;
};

const AddGuestDialog = ({
  classObj,
  onClose,
  onSubmit,
  open,
  sessionId,
}: Props) => {
  const classes = useStyles();
  const [shouldDisplaySearch, setShouldDisplaySearch] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [familyResults, setFamilyResults] = useState<SelectableFamily[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [enrolment, setEnrolment] = useState<
    Omit<EnrolmentRequest, "id" | "family"> & {
      family: FamilySearchResponse | null;
    }
  >(getDefaultGuestEnrolmentData(sessionId, classObj.id));
  const [
    expandedFamily,
    setExpandedFamily,
  ] = useState<FamilySearchResponse | null>(null);
  const [guests, setGuests] = useState<
    (StudentListRequest & { index: number })[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const resetDialog = () => {
    setFirstName("");
    setLastName("");
    setShouldDisplaySearch(false);
    setFamilyResults([]);
    setIsConfirming(false);
    setEnrolment(getDefaultGuestEnrolmentData(sessionId, classObj.id));
    setExpandedFamily(null);
    setGuests([]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (open) {
      resetDialog();
    }
  }, [open]);

  const onSubmitSearch = async () => {
    setFamilyResults(
      (await FamilyAPI.getFamiliesByStudentName(firstName, lastName)).map(
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

  const handleSubmit = async () => {
    const { family } = enrolment;
    if (!family) {
      return;
    }
    setIsLoading(true);
    try {
      const guestIds: number[] = [];
      await Promise.all(
        guests.map(async (guest) => {
          const res = await FamilyAPI.postStudent(guest);
          guestIds.push(res.id);
        })
      );
      const existingEnrolment = family.enrolments.find(
        (e) => e.enrolled_class?.id === classObj.id
      );
      if (existingEnrolment) {
        await EnrolmentAPI.putEnrolment({
          ...enrolmentResponseToRequest(existingEnrolment),
          students: [
            ...existingEnrolment.students,
            ...enrolment.students,
            ...guestIds,
          ],
        });
      } else {
        await EnrolmentAPI.postEnrolment({
          ...enrolment,
          family: family.id,
          students: [...enrolment.students, ...guestIds],
        });
      }
      onSubmit();
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err);
    }
    setIsLoading(false);
  };

  // Selecting existing students ==============================================

  const handleSelectStudent = (
    family: FamilySearchResponse,
    studentId: number
  ) => {
    if (family.id === enrolment.family?.id) {
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
      setEnrolment({ ...enrolment, family, students: [studentId] });
    }
  };

  const enrolledStudentIds = classObj.families.flatMap(
    (family) => family.enrolment?.students
  );

  const isNotSelected = (familyId: number) =>
    enrolment.family !== null && enrolment.family?.id !== familyId;

  const getSelectButtonState = (
    familyId: number,
    isParent: boolean,
    studentId: number
  ) => {
    if (isNotSelected(familyId)) {
      return {
        message: "Another family is currently selected",
        selected: false,
      };
    }
    if (enrolledStudentIds.includes(studentId)) {
      return {
        message: `This student is already registered in ${classObj.name}`,
        selected: false,
      };
    }

    const isParentWithSelectedMembers =
      isParent &&
      familyId === enrolment.family?.id &&
      // guests have been created, or any of the existing children or guests
      // have been selected
      (guests.length > 0 ||
        enrolment.students.find((id) => id !== studentId) !== undefined);
    if (isParentWithSelectedMembers) {
      return {
        message: "Members in this family have been selected",
        selected: true,
      };
    }

    return { message: "", selected: false };
  };

  const getSelectButton = (
    family: FamilySearchResponse,
    studentId: number,
    isParent: boolean
  ) => {
    const selectButtonState = getSelectButtonState(
      family.id,
      isParent,
      studentId
    );
    if (selectButtonState.message.length) {
      return (
        <Tooltip
          title={selectButtonState.message}
          aria-label="cannot select student"
        >
          <span>
            <RoundedOutlinedButton className={classes.selectButton} disabled>
              {selectButtonState.selected ? "Unselect" : "Select"}
            </RoundedOutlinedButton>
          </span>
        </Tooltip>
      );
    }

    return (
      <RoundedOutlinedButton
        className={classes.selectButton}
        onClick={() => handleSelectStudent(family, studentId)}
      >
        {enrolment.students.includes(studentId) ? "Unselect" : "Select"}
      </RoundedOutlinedButton>
    );
  };

  // New guests ===============================================================

  const addGuest = (family: FamilySearchResponse) => {
    setGuests([
      ...guests,
      {
        first_name: "",
        last_name: "",
        role: StudentRole.GUEST,
        family: family.id,
        index: generateKey(),
      },
    ]);
    setEnrolment({ ...enrolment, family });
  };

  const updateGuest = (i: number, data: StudentListRequest) => {
    const guestsData = [...guests];
    guestsData[i] = { ...guests[i], ...data };
    setGuests([...guestsData]);
  };

  const deleteGuest = (index: number) => {
    setGuests([...guests.filter((guest) => guest.index !== index)]);
  };

  // Setting the selected/expanded family =====================================

  const onClickExpand = (family: FamilySearchResponse) => {
    if (family.id === expandedFamily?.id) {
      setExpandedFamily(null);
    } else {
      setExpandedFamily({ ...family });
    }
  };

  useEffect(() => {
    // if all students and guests have been unselected, clear the family
    if (!enrolment.students.length && !guests.length) {
      setEnrolment({ ...enrolment, family: null });
    }
  }, [enrolment.students, guests]);

  useEffect(() => {
    // if a family was selected, expand their additional members
    if (enrolment.family !== null) {
      setExpandedFamily(
        familyResults.find((family) => family.id === enrolment.family?.id) ||
          null
      );
    }
  }, [enrolment.family]);

  return (
    <>
      {isLoading && <SpinnerOverlay />}
      <Dialog
        open={open}
        onClose={() => setIsConfirming(true)}
        disableBackdropClick
        fullWidth
        maxWidth="md"
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle disableTypography>
          <Typography variant="h2">Add a guest</Typography>
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
            disabled={enrolment.students.length > 0}
            disabledMessage="Clear student selections to search"
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
                className={classes.tableContainer}
                component={Paper}
                elevation={0}
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
                          {/* Parent */}
                          <TableRow key={family.id}>
                            <TableCell className={classes.iconButtonTableCell}>
                              <IconButton
                                aria-expanded={family.id === expandedFamily?.id}
                                aria-label="show students"
                                className={`${classes.expandButton} ${
                                  family.id === expandedFamily?.id &&
                                  classes.expandButtonOpen
                                }`}
                                disabled={isNotSelected(family.id)}
                                onClick={() => onClickExpand(family)}
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
                                onClick={() => addGuest(family)}
                                size="small"
                              >
                                <AddCircleOutline />
                              </IconButton>
                            </TableCell>
                            <TableCell className={classes.densePaddingY}>
                              {getSelectButton(family, family.parent.id, true)}
                            </TableCell>
                          </TableRow>

                          {/* New guests added */}
                          {family.id === expandedFamily?.id && (
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
                                      <Tooltip
                                        aria-label="delete guest to unselect"
                                        title="Delete guest to unselect"
                                      >
                                        <span>
                                          <RoundedOutlinedButton
                                            className={classes.selectButton}
                                            disabled
                                          >
                                            Unselect
                                          </RoundedOutlinedButton>
                                        </span>
                                      </Tooltip>
                                    </TableCell>
                                  </TableRow>
                                ))}

                              {/* Existing children and guests */}
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
                                    <TableCell
                                      className={classes.densePaddingY}
                                    >
                                      {getSelectButton(
                                        family,
                                        student.id,
                                        false
                                      )}
                                    </TableCell>
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
          <Tooltip
            aria-label="select students to add"
            title={enrolment.family === null ? "Select students to add" : ""}
          >
            <span>
              <Button
                color="primary"
                disabled={enrolment.family === null}
                onClick={handleSubmit}
                type="button"
                variant="contained"
              >
                Done
              </Button>
            </span>
          </Tooltip>
        </DialogContent>
      </Dialog>
      <ConfirmationDialog
        cancelButtonLabel="Cancel"
        confirmButtonLabel="Continue"
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
