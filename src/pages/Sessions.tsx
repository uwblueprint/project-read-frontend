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
import { makeStyles } from "@material-ui/core/styles";

import SessionAPI from "../api/SessionAPI";
import RegistrationDialog from "../components/registration/RegistrationDialog";
import { Session } from "../types";

const useStyles = makeStyles(() => ({
  tabButton: {
    backgroundColor: "#E7E7E7",
    borderRadius: "15px 15px 0px 0px",
    opacity: "100%",
    border: "1px solid #C8C8C8",
    borderBottom: "0px",
    fontWeight: 700,
  },
}));

type TabPanelProps = {
  children: JSX.Element;
  value: number;
  index: number;
};

type ClassIndex = {
  id: number;
  name: string;
  facilitator_id: number;
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
  const [classes, setClasses] = useState<ClassIndex[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number>();
  const [displayRegDialog, setDisplayRegDialog] = useState(false);
  const styles = useStyles();

  const handleChangeClasses = async (id: number) => {
    const classesData = await SessionAPI.getClasses(id);
    setClasses(classesData);
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
      <Box mt={4}>
        <AppBar position="static">
          <Tabs
            TabIndicatorProps={{ style: { backgroundColor: "inherit" } }}
            value={tab}
            onChange={handleTabChange}
            aria-label="Classes Tabs"
          >
            {/* eslint-disable react/jsx-props-no-spreading */}
            <Tab label="All Classes" {...tabProps(0)} />
            {classes.map((classInfo) => (
              /* eslint-disable react/jsx-props-no-spreading */
              <Tab
                key={classInfo.id}
                label={classInfo.name}
                {...tabProps(classInfo.id)}
              />
            ))}
            <Button className={styles.tabButton}>
              <Add />
            </Button>
          </Tabs>
        </AppBar>
        <TabPanel key="all" value={tab} index={0}>
          <div>All items</div>
        </TabPanel>
        {classes.map((classInfo, i) => (
          <TabPanel key={classInfo.id} value={tab} index={i + 1}>
            <div>Class Id: {classInfo.id}</div>
          </TabPanel>
        ))}
      </Box>
    </>
  );
};

export default Sessions;
