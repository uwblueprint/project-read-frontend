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
import { useHistory, useParams } from "react-router-dom";

import ClassAPI from "api/ClassAPI";
import EnrolmentAPI from "api/EnrolmentAPI";
import FamilyAPI from "api/FamilyAPI";
import SessionAPI from "api/SessionAPI";
import {
  ClassDetailResponse,
  SessionListResponse,
  SessionDetailResponse,
  FamilyListResponse,
  FamilyDetailResponse,
  EnrolmentRequest,
} from "api/types";
import Spinner from "components/common/spinner";
import SpinnerOverlay from "components/common/spinner-overlay";
import FamilySidebar from "components/families/family-sidebar";
import FamilyTable from "components/families/family-table";
import RegistrationForm from "components/registration/registration-form";
import RegistrationDialog from "components/registration/RegistrationDialog";
import SessionDetailView, {
  ALL_CLASSES_TAB_INDEX,
} from "components/sessions/session-detail-view";
import DefaultFields from "constants/DefaultFields";

const NEW_SESSION = -1;

const isOnAllClassesTab = (classTabIndex: number) =>
  classTabIndex === ALL_CLASSES_TAB_INDEX;

type Params = {
  classId: string | undefined;
  sessionId: string | undefined;
};

const Sessions = () => {
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [
    selectedFamily,
    setSelectedFamily,
  ] = useState<FamilyDetailResponse | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isLoadingClass, setIsLoadingClass] = useState(false);
  const [isLoadingFamily, setIsLoadingFamily] = useState(false);

  const updateSelectedSession = async (id: number) => {
    setSelectedSession(await SessionAPI.getSession(id));
    setIsLoadingSession(false);
  };

  const goToLatestOrProvidedSession = () => {
    if (!sessions.length) {
      return;
    }
    if (!sessionId) {
      history.push(`/sessions/${sessions[0].id}`);
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
    const classObj = await ClassAPI.getClass(id);
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

  const onEditFamilyCurrentEnrolment = async (data: EnrolmentRequest) => {
    if (selectedFamily === null || selectedFamily.current_enrolment === null) {
      return;
    }
    setSelectedFamily({
      ...selectedFamily,
      current_enrolment: await EnrolmentAPI.putEnrolment(data),
    });
    resetSession();
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
            <Box flexShrink={0}>
              <Button variant="outlined" onClick={handleOpenFormDialog}>
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
                    onRegister={(enrolment) => {
                      setDisplayRegDialog(false);
                      setClassTabIndex(ALL_CLASSES_TAB_INDEX);
                      setSnackbarMessage(
                        `Successfully added ${enrolment.family.parent.first_name} ${enrolment.family.parent.last_name} to this session.`
                      );
                      updateSelectedSession(selectedSession.id);
                    }}
                    session={selectedSession}
                  />
                )
              }
            />
          </>
        )}
      </Box>
      {selectedSession && (
        <SessionDetailView
          classes={selectedSession.classes}
          classTabIndex={classTabIndex}
          onChangeClassTabIndex={handleChangeClassTabIndex}
          classDefaultView={
            <>
              <FamilyTable
                families={getFamilies()}
                enrolmentFields={
                  isOnAllClassesTab(classTabIndex)
                    ? [DefaultFields.ENROLLED_CLASS]
                    : []
                }
                shouldDisplayDynamicFields={false}
                onSelectFamily={async (id) => {
                  await onSelectFamily(id);
                  setIsSidebarOpen(true);
                }}
              />
              {selectedFamily && (
                <FamilySidebar
                  isOpen={isSidebarOpen}
                  family={selectedFamily}
                  onClose={() => setIsSidebarOpen(false)}
                  onEditCurrentEnrolment={onEditFamilyCurrentEnrolment}
                  onSaveFamily={onSaveFamily}
                />
              )}
            </>
          }
        />
      )}
    </>
  );
};

export default Sessions;
