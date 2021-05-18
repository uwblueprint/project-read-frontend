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
import { Add } from "@material-ui/icons";

import SessionAPI from "../api/SessionAPI";
import RegistrationDialog from "../components/registration/RegistrationDialog";
import { Session } from "../types";

const Sessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number>();
  const [displayRegDialog, setDisplayRegDialog] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      const sessionsData = await SessionAPI.getSessions();
      setSessions(sessionsData);
      if (sessionsData.length) {
        setCurrentSessionId(sessionsData[0].id); // most recent session
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
  };

  return (
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
              New registrant
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
  );
};

export default Sessions;
