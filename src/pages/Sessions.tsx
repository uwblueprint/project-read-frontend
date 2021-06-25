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
import SessionAPI, { SessionListResponse } from "../api/SessionAPI";
import ClassAPI, { ClassDetailResponse } from "../api/ClassAPI";
import RegistrationDialog from "../components/registration/RegistrationDialog";
import { FamilyListResponse } from "../api/FamilyAPI";
import FamilyTable from "../components/families/FamilyTable";
import SessionDetailView, {
  ALL_CLASSES_TAB_INDEX,
} from "../components/sessions/SessionDetailView";
import { DefaultFields } from "../constants/DefaultFields";

const Sessions = () => {
  const [sessions, setSessions] = useState<SessionListResponse[]>([]);
  const [classesMap, setClassesMap] = useState(
    new Map<number, ClassDetailResponse>()
  );
  const [classTabIndex, setClassTabIndex] = useState(ALL_CLASSES_TAB_INDEX);
  const [currentSessionId, setCurrentSessionId] = useState<number>();
  const [displayRegDialog, setDisplayRegDialog] = useState(false);

  const handleChangeClasses = async (id: number) => {
    const sessionClasses = await SessionAPI.getSessionClasses(id);
    const map = new Map<number, ClassDetailResponse>();
    await Promise.all(
      sessionClasses.map(async (sessionClass) => {
        const classMapItem = await ClassAPI.getClass(sessionClass.id);
        map.set(sessionClass.id, classMapItem);
      })
    );
    setClassesMap(map);
  };

  useEffect(() => {
    const fetchSessions = async () => {
      const sessionsData = await SessionAPI.getSessions();
      setSessions(sessionsData);
      if (sessionsData.length) {
        setCurrentSessionId(sessionsData[0].id); // most recent session
        handleChangeClasses(sessionsData[0].id);
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

  const handleChangeCurrentSessionId = (
    e: React.ChangeEvent<{ value: unknown }>
  ) => {
    setCurrentSessionId(e.target.value as number);
    handleChangeClasses(e.target.value as number);
    setClassTabIndex(ALL_CLASSES_TAB_INDEX);
  };

  const isOnAllClassesTab = classTabIndex === ALL_CLASSES_TAB_INDEX;

  const getFamilies = (): FamilyListResponse[] => {
    if (isOnAllClassesTab) {
      let allClassesFamilies: FamilyListResponse[] = [];
      Array.from(classesMap.values()).forEach((classData) => {
        allClassesFamilies = allClassesFamilies.concat(classData.families);
      });
      return allClassesFamilies;
    }
    const classData = classesMap.get(classTabIndex);
    if (!classData) {
      return [];
    }
    return classData.families;
  };

  const getEnrolmentFields = isOnAllClassesTab
    ? [DefaultFields.CURRENT_CLASS, DefaultFields.STATUS]
    : [DefaultFields.STATUS];

  return (
    <>
      <Box display="flex">
        <Box display="flex" flexGrow={1} alignItems="center">
          <Box mr={3}>
            <Typography variant="h1">Session:</Typography>
          </Box>
          <Box>
            {currentSessionId && (
              <FormControl variant="outlined">
                <InputLabel id="session">Session</InputLabel>
                <Select
                  id="select"
                  label="session"
                  labelId="session"
                  value={currentSessionId}
                  onChange={handleChangeCurrentSessionId}
                >
                  {sessions.map((session) => (
                    <MenuItem key={session.id} value={session.id}>
                      {session.season} {session.year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </Box>
        {currentSessionId && (
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
            />
          </>
        )}
      </Box>
      <SessionDetailView
        classes={Array.from(classesMap.values())}
        classTabIndex={classTabIndex}
        onChangeClassTabIndex={setClassTabIndex}
        classDefaultView={
          <FamilyTable
            families={getFamilies()}
            enrolmentFields={getEnrolmentFields}
            shouldDisplayDynamicFields={false}
          />
        }
      />
    </>
  );
};

export default Sessions;
