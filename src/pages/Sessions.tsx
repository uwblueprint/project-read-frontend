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
import { Add } from "@material-ui/icons/";
import { makeStyles } from "@material-ui/core/styles";
import SessionAPI, { SessionListResponse, ClassIndex } from "../api/SessionAPI";
import ClassAPI, { Class } from "../api/ClassAPI";
import RegistrationDialog from "../components/registration/RegistrationDialog";
import { FamilyListResponse } from "../api/FamilyAPI";
import FamilyTable from "../components/families/FamilyTable";
import { DefaultFields } from "../constants/DefaultFields";

const useStyles = makeStyles(() => ({
  borderBottom: {
    borderBottom: "1px solid #C8C8C8",
    opacity: 0.7,
    backgroundColor: "inherit",
  },
  appbar: {
    flexDirection: "row",
    backgroundColor: "inherit",
  },
}));

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
  const [sessions, setSessions] = useState<SessionListResponse[]>([]);
  const [classes, setClasses] = useState<ClassIndex[]>([]);
  const [classesData, setClassesData] = useState(new Map<number, Class>());
  const [currentSessionId, setCurrentSessionId] = useState<number>();
  const [displayRegDialog, setDisplayRegDialog] = useState(false);
  const styles = useStyles();

  const handleChangeClasses = async (id: number) => {
    const classesInSession = await SessionAPI.getClasses(id);
    setClasses(classesInSession);

    const classesMap = new Map<number, Class>();

    await Promise.all(
      classesInSession.map(async (classInSession) => {
        const classMapItem = await ClassAPI.getClass(classInSession.id);
        classesMap.set(classInSession.id, classMapItem);
      })
    );

    setClassesData(classesMap);
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
    setTab(0);
  };

  const handleTabChange = async (e: any, newTab: number) => {
    setTab(newTab);
  };

  const tabProps = (index: number) => ({
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  });

  const getFamilies = (): FamilyListResponse[] => {
    if (tab === 0) {
      let allClassesFamilies: FamilyListResponse[] = [];
      classesData.forEach((classData) => {
        allClassesFamilies = allClassesFamilies.concat(classData.families);
      });
      return allClassesFamilies;
    }
    const classData = classesData.get(tab);
    if (!classData) {
      return [];
    }
    return classData.families;
  };

  const SessionFamilyTable = () => (
    <FamilyTable
      families={getFamilies()}
      enrolmentFields={[DefaultFields.CURRENT_CLASS, DefaultFields.STATUS]}
      displayDynamicFields={false}
    />
  );

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
        <AppBar position="static" className={styles.appbar}>
          <Tabs
            TabIndicatorProps={{ style: { backgroundColor: "inherit" } }}
            value={tab}
            onChange={(event, value) => {
              handleTabChange(event, value);
            }}
            aria-label="Classes Tabs"
          >
            <Tab
              value={0}
              label="All Classes"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...tabProps(0)}
            />
            {classes.map((classInfo) => (
              <Tab
                value={classInfo.id}
                key={classInfo.id}
                label={classInfo.name}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...tabProps(classInfo.id)}
              />
            ))}
          </Tabs>
          <Box flexGrow={1} className={styles.borderBottom} />
        </AppBar>
        <TabPanel key="all" value={tab} index={0}>
          <SessionFamilyTable />
        </TabPanel>
        {classes.map((classInfo) => (
          <TabPanel key={classInfo.id} value={tab} index={classInfo.id}>
            <SessionFamilyTable />
          </TabPanel>
        ))}
      </Box>
    </>
  );
};

export default Sessions;
