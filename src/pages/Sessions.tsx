import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  AppBar,
  Tabs,
  Tab,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";

import SessionAPI from "../api/SessionAPI";
import RegistrationDialog from "../components/registration/RegistrationDialog";
import { Session } from "../types";

type TabPanelProps = {
  children: JSX.Element;
  value: number;
  index: number;
};

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
  >
    {value === index && <Box p={3}>{children}</Box>}
  </div>
);

const Sessions = () => {
  const [tab, setTab] = useState<number>(0);
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

  const handleTabChange = (e: any, newTab: number) => {
    setTab(newTab);
  };

  const tabProps = (index: number) => ({
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  });

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
                Add a client
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
      <Box mt={4}>
        <AppBar position="static">
          <Tabs
            value={tab}
            onChange={handleTabChange}
            aria-label="Session Tabs"
          >
            {sessions.map((session) => (
              /* eslint-disable react/jsx-props-no-spreading */
              <Tab
                key={session.id}
                label={session.id}
                {...tabProps(session.id)}
              />
            ))}
          </Tabs>
        </AppBar>
        {sessions.map((session, i) => (
          <TabPanel key={session.id} value={tab} index={i}>
            <div>Item {session.id}</div>
          </TabPanel>
        ))}
      </Box>
    </>
  );
};

export default Sessions;
