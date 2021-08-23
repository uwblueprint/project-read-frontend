import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { Add } from "@material-ui/icons/";
import { makeStyles } from "@material-ui/styles";
import { useHistory, useParams } from "react-router-dom";

import ClassAPI from "api/ClassAPI";
import FamilyAPI from "api/FamilyAPI";
import SessionAPI from "api/SessionAPI";
import {
  ClassDetailResponse,
  ClassDetailRequest,
  SessionListResponse,
  SessionDetailResponse,
  FamilyListResponse,
  FamilyDetailResponse,
  EnrolmentRequest,
} from "api/types";
import Spinner from "components/common/spinner";
import SpinnerOverlay from "components/common/spinner-overlay";
import FamilySidebar from "components/families/family-sidebar";
import saveEnrolments from "components/families/family-sidebar/utils";
import FamilyTable from "components/families/family-table";
import AddGuestDialog from "components/registration/add-guest-dialog";
import RegistrationForm from "components/registration/registration-form";
import RegistrationDialog from "components/registration/RegistrationDialog";
import AttendanceTable from "components/sessions/attendance-table";
import SessionDetailView, {
  ALL_CLASSES_TAB_INDEX,
} from "components/sessions/session-detail-view";
import AddClassDialog from "components/sessions/session-detail-view/AddClassDialog";
import DefaultFields from "constants/DefaultFields";

const NEW_SESSION = -1;

const isOnAllClassesTab = (classTabIndex: number) =>
  classTabIndex === ALL_CLASSES_TAB_INDEX;

const useStyles = makeStyles(() => ({
  registerButton: {
    marginLeft: "20px",
  },
}));

type Params = {
  classId: string | undefined;
  sessionId: string | undefined;
};

const Sessions = () => {
  const classes = useStyles();
  const history = useHistory();
  const { classId, sessionId } = useParams<Params>();
  const [sessions, setSessions] = useState<SessionListResponse[]>([]);
  const [
    selectedSession,
    setSelectedSession,
  ] = useState<SessionDetailResponse>();
  const [classesMap, setClassesMap] = useState(
    new Map<number, ClassDetailResponse>()
  );
  const [classTabIndex, setClassTabIndex] = useState(ALL_CLASSES_TAB_INDEX);
  const [displayRegDialog, setDisplayRegDialog] = useState(false);
  const [displayAddGuestDialog, setDisplayAddGuestDialog] = useState(false);
  const [isOnAttendanceView, setAttendanceView] = useState(false);
  const [isEditingAttendance, setIsEditingAttendance] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [
    selectedFamily,
    setSelectedFamily,
  ] = useState<FamilyDetailResponse | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isLoadingClass, setIsLoadingClass] = useState(false);
  const [isLoadingFamily, setIsLoadingFamily] = useState(false);

  const goTo404 = () => {
    history.push("/oops");
  };

  const updateSelectedSession = async (id: number) => {
    try {
      setSelectedSession(await SessionAPI.getSession(id));
    } catch (err) {
      goTo404();
    }
    setIsLoadingSession(false);
  };

  const goToLatestOrProvidedSession = () => {
    if (!sessions.length) {
      return;
    }
    if (!sessionId) {
      history.push(`/sessions/${sessions[sessions.length - 1].id}`);
    } else {
      updateSelectedSession(Number(sessionId));
    }
  };

  useEffect(() => {
    const fetchSessions = async () => {
      const sessionsData = await SessionAPI.getSessions();
      setSessions(sessionsData);
    };
    setIsLoadingSession(true);
    if (!sessions.length) {
      fetchSessions();
      return;
    }
    goToLatestOrProvidedSession();
  }, [sessionId]);

  useEffect(() => {
    if (sessions.length) {
      goToLatestOrProvidedSession();
    }
  }, [sessions]);

  const handleOpenFormDialog = () => {
    setDisplayRegDialog(true);
  };

  const handleCloseFormDialog = () => {
    setDisplayRegDialog(false);
  };

  const resetClass = async (id: number) => {
    setIsLoadingClass(true);
    let classObj: ClassDetailResponse;
    try {
      classObj = await ClassAPI.getClass(id);
    } catch (err) {
      goTo404();
    }
    setClassesMap(
      (prevMap) => new Map([...Array.from(prevMap), [classObj.id, classObj]])
    );
    setIsLoadingClass(false);
  };

  useEffect(() => {
    if (classId === undefined) {
      setClassTabIndex(ALL_CLASSES_TAB_INDEX);
      return;
    }
    const classIdNumber = Number(classId);
    if (!classesMap.has(classIdNumber)) {
      resetClass(classIdNumber);
    }
    setClassTabIndex(classIdNumber);
  }, [classId]);

  const handleChangeCurrentSessionId = async (
    e: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newSessionId = e.target.value as number;
    if (newSessionId === NEW_SESSION) {
      history.push("/sessions/create");
    } else {
      history.push(`/sessions/${newSessionId}`);
    }
  };

  const handleChangeClassTabIndex = (newClassTabIndex: number) => {
    if (isOnAllClassesTab(newClassTabIndex)) {
      history.push(`/sessions/${sessionId}`);
    } else {
      history.push(`/sessions/${sessionId}/classes/${newClassTabIndex}`);
    }
  };

  const getFamilies = (): FamilyListResponse[] => {
    if (selectedSession !== undefined && isOnAllClassesTab(classTabIndex)) {
      return selectedSession.families;
    }
    const classObj = classesMap.get(classTabIndex);
    return classObj !== undefined ? classObj.families : [];
  };

  useEffect(() => {
    setIsEditingAttendance(false);
  }, [isOnAttendanceView, classTabIndex]);

  const onSubmitAttendance = async (classObj: ClassDetailRequest) => {
    const updatedClass = await ClassAPI.putClass(classObj);
    setClassesMap(
      (prevMap) =>
        new Map([...Array.from(prevMap), [classObj.id, updatedClass]])
    );
    setIsEditingAttendance(!isEditingAttendance);
  };

  const onSelectFamily = async (id: number | null) => {
    setIsLoadingFamily(true);
    const family = id ? await FamilyAPI.getFamilyById(id) : null;
    setSelectedFamily(family);
    setIsLoadingFamily(false);
  };

  const resetSession = () => {
    updateSelectedSession(selectedSession!.id);
    classesMap.forEach(({ id }) => {
      resetClass(id);
    });
  };

  const onSaveFamily = async (
    family: FamilyDetailResponse,
    refetch: boolean
  ) => {
    setSelectedFamily(family);
    if (refetch) {
      resetSession();
    }
  };

  const onEditFamilyEnrolment = async (data: EnrolmentRequest) => {
    if (selectedFamily === null) {
      return;
    }
    const enrolments = await saveEnrolments(selectedFamily.enrolments, data);
    setSelectedFamily({
      ...selectedFamily,
      enrolments,
    });
    resetSession();
  };

  const getClassView = () => {
    const selectedClass = classesMap.get(classTabIndex);
    if (isOnAttendanceView && selectedClass) {
      return (
        <>
          <AttendanceTable
            classObj={selectedClass}
            isEditing={isEditingAttendance}
            onClickAddGuest={() => setDisplayAddGuestDialog(true)}
            onSelectFamily={async (id) => {
              await onSelectFamily(id);
              setIsSidebarOpen(true);
            }}
            onSubmit={onSubmitAttendance}
          />
          <AddGuestDialog
            classObj={selectedClass}
            onClose={() => setDisplayAddGuestDialog(false)}
            open={displayAddGuestDialog}
            sessionId={selectedSession!.id}
          />
        </>
      );
    }
    return (
      <FamilyTable
        families={getFamilies()}
        enrolmentFields={
          isOnAllClassesTab(classTabIndex)
            ? [DefaultFields.REGISTERED_AT, DefaultFields.ENROLLED_CLASS]
            : [DefaultFields.REGISTERED_AT]
        }
        shouldDisplayDynamicFields={false}
        onSelectFamily={async (id) => {
          await onSelectFamily(id);
          setIsSidebarOpen(true);
        }}
      />
    );
  };

  return (
    <>
      {(isLoadingSession || isLoadingClass) && <SpinnerOverlay />}
      <Box display="flex">
        <Box display="flex" flexGrow={1} alignItems="center">
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            autoHideDuration={5000}
            message={snackbarMessage}
            onClose={() => {
              setSnackbarMessage("");
            }}
            open={snackbarMessage !== ""}
          />
          <Box mr={3}>
            <Typography variant="h1">Session:</Typography>
          </Box>
          {selectedSession && (
            <Box>
              <FormControl variant="outlined">
                <InputLabel id="session">Session</InputLabel>
                <Select
                  id="select"
                  label="session"
                  labelId="session"
                  value={selectedSession.id}
                  onChange={handleChangeCurrentSessionId}
                >
                  {sessions.map((session) => (
                    <MenuItem key={session.id} value={session.id}>
                      {session.name}
                    </MenuItem>
                  ))}
                  <MenuItem value={NEW_SESSION}>Add new session</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>
        {selectedSession && (
          <>
            {classTabIndex !== ALL_CLASSES_TAB_INDEX && (
              <FormControl variant="outlined">
                <InputLabel id="view">View</InputLabel>
                <Select
                  id="select"
                  label="view"
                  labelId="view"
                  value={!isOnAttendanceView ? "default" : "attendance"}
                >
                  <MenuItem
                    value="default"
                    onClick={() => setAttendanceView(false)}
                  >
                    Default view
                  </MenuItem>
                  <MenuItem
                    value="attendance"
                    onClick={() => setAttendanceView(true)}
                  >
                    Attendance view
                  </MenuItem>
                </Select>
              </FormControl>
            )}
            <Box flexShrink={0}>
              <Button
                variant="outlined"
                onClick={handleOpenFormDialog}
                className={classes.registerButton}
              >
                Add a client &nbsp;
                <Add />
              </Button>
            </Box>
            <RegistrationDialog
              open={displayRegDialog}
              onClose={handleCloseFormDialog}
              onSelectFamily={onSelectFamily}
              registrationForm={
                isLoadingFamily ? (
                  <Spinner />
                ) : (
                  <RegistrationForm
                    existingFamily={selectedFamily}
                    onRegister={(family) => {
                      setDisplayRegDialog(false);
                      setClassTabIndex(ALL_CLASSES_TAB_INDEX);
                      setSnackbarMessage(
                        `Successfully added ${family.parent.first_name} ${family.parent.last_name} to this session.`
                      );
                      updateSelectedSession(selectedSession.id);
                    }}
                    session={selectedSession}
                  />
                )
              }
              session={selectedSession}
            />
            <AddClassDialog
              open={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              session={selectedSession}
              onClassCreate={(newClass) => {
                setClassTabIndex(ALL_CLASSES_TAB_INDEX);
                setSnackbarMessage(
                  `Successfully created class ${newClass.name} in this session.`
                );
                updateSelectedSession(selectedSession.id);
                setIsDialogOpen(false);
              }}
            />
          </>
        )}
      </Box>
      {selectedSession && (
        <SessionDetailView
          classes={selectedSession.classes}
          classTabIndex={classTabIndex}
          onChangeClassTabIndex={handleChangeClassTabIndex}
          classDefaultView={getClassView()}
          onDialogOpen={() => setIsDialogOpen(true)}
        />
      )}
      {selectedFamily && (
        <FamilySidebar
          isOpen={isSidebarOpen}
          family={selectedFamily}
          onClose={() => setIsSidebarOpen(false)}
          onEditEnrolment={onEditFamilyEnrolment}
          onSaveFamily={onSaveFamily}
        />
      )}
    </>
  );
};

export default Sessions;
