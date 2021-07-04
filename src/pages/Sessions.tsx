import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
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
import SessionAPI, {
  SessionListResponse,
  SessionDetailResponse,
} from "../api/SessionAPI";
import ClassAPI, { ClassDetailResponse } from "../api/ClassAPI";
import RegistrationDialog from "../components/registration/RegistrationDialog";
import { FamilyListResponse } from "../api/FamilyAPI";
import FamilyTable from "../components/families/FamilyTable";
import SessionDetailView, {
  ALL_CLASSES_TAB_INDEX,
} from "../components/sessions/session-detail-view";
import { DefaultFields } from "../constants/DefaultFields";

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

  useEffect(() => {
    const fetchClass = async (id: number) => {
      const classObj = await ClassAPI.getClass(id);
      setClassesMap(
        (prevMap) => new Map([...Array.from(prevMap), [classObj.id, classObj]])
      );
    };
    if (classId === undefined) {
      setClassTabIndex(ALL_CLASSES_TAB_INDEX);
      return;
    }
    const classIdNumber = Number(classId);
    if (!classesMap.has(classIdNumber)) {
      fetchClass(classIdNumber);
    }
    setClassTabIndex(classIdNumber);
  }, [classId]);

  const handleChangeCurrentSessionId = async (
    e: React.ChangeEvent<{ value: unknown }>
  ) => {
    history.push(`/sessions/${e.target.value as number}`);
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
                      {session.season} {session.year}
                    </MenuItem>
                  ))}
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
            <FamilyTable
              families={getFamilies()}
              enrolmentFields={getEnrolmentFields}
              shouldDisplayDynamicFields={false}
            />
          }
        />
      )}
    </>
  );
};

export default Sessions;
