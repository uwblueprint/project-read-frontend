import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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
import FamilySidebar from "components/families/family-sidebar";
import FamilyTable from "components/families/family-table";
import RegistrationDialog from "components/registration/RegistrationDialog";
import SessionDetailView, {
  ALL_CLASSES_TAB_INDEX,
} from "components/sessions/session-detail-view";
import { DefaultFields } from "constants/DefaultFields";

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
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [displayRegDialog, setDisplayRegDialog] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [
    selectedFamily,
    setSelectedFamily,
  ] = useState<FamilyDetailResponse | null>(null);

  const updateSelectedSession = async (id: number) => {
    await setSelectedSession(await SessionAPI.getSession(id));
    setIsLoadingSession(false);
  };

  useEffect(() => {
    const fetchSessions = async () => {
      const sessionsData = await SessionAPI.getSessions();
      setSessions(sessionsData);
      if (sessionId !== undefined) {
        // if a session id was provided in the url, set it to that
        updateSelectedSession(Number(sessionId));
      } else if (sessionsData.length) {
        // redirect to the most recent session
        history.push(`/sessions/${sessionsData[0].id}`);
        updateSelectedSession(sessionsData[0].id);
      }
    };
    fetchSessions();
  }, []);

  const handleOpenFormDialog = () => {
    setDisplayRegDialog(true);
  };

  const handleCloseFormDialog = () => {
    setDisplayRegDialog(false);
  };

  useEffect(() => {
    setIsLoadingSession(true);
    if (sessionId !== undefined) {
      updateSelectedSession(Number(sessionId));
    }
  }, [sessionId]);

  const resetClass = async (id: number) => {
    const classObj = await ClassAPI.getClass(id);
    setClassesMap(
      (prevMap) => new Map([...Array.from(prevMap), [classObj.id, classObj]])
    );
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

  const getEnrolmentFields = isOnAllClassesTab(classTabIndex)
    ? [DefaultFields.CURRENT_CLASS]
    : [];

  const onSelectFamily = async (id: number) => {
    const family = await FamilyAPI.getFamilyById(id);
    setSelectedFamily(family);
    setIsSidebarOpen(true);
  };

  const onEditFamily = async () => {
    // TODO: make put request
  };

  const onEditFamilyCurrentEnrolment = async (data: EnrolmentRequest) => {
    if (selectedFamily === null || selectedFamily.current_enrolment === null) {
      return;
    }
    setSelectedFamily({
      ...selectedFamily,
      current_enrolment: await EnrolmentAPI.putEnrolment(data),
    });
    if (selectedSession) {
      updateSelectedSession(selectedSession.id);
    }
    classesMap.forEach(({ id }) => {
      resetClass(id);
    });
  };

  return (
    <>
      <Box display="flex">
        <Box display="flex" flexGrow={1} alignItems="center">
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
              session={selectedSession}
            />
          </>
        )}
      </Box>
      {!isLoadingSession && selectedSession && (
        <SessionDetailView
          classes={selectedSession.classes}
          classTabIndex={classTabIndex}
          onChangeClassTabIndex={handleChangeClassTabIndex}
          classDefaultView={
            <>
              <FamilyTable
                families={getFamilies()}
                enrolmentFields={getEnrolmentFields}
                shouldDisplayDynamicFields={false}
                onSelectFamily={onSelectFamily}
              />
              {selectedFamily && (
                <FamilySidebar
                  isOpen={isSidebarOpen}
                  family={selectedFamily}
                  onClose={() => setIsSidebarOpen(false)}
                  onEditCurrentEnrolment={onEditFamilyCurrentEnrolment}
                  onEditFamily={onEditFamily}
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
