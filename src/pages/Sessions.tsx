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
import SessionAPI from "../api/SessionAPI";
import ClassAPI from "../api/ClassAPI";
import RegistrationDialog from "../components/registration/RegistrationDialog";
import { Session, ClassInfo } from "../types";
// import { DynamicFieldsContext } from "../context/DynamicFieldsContext";
import DefaultFieldKey from "../constants/DefaultFieldKey";
import { FamilyListResponse } from "../api/FamilyAPI";
import SessionTable from "../components/sessions/SessionTable";

const useStyles = makeStyles(() => ({
  // tabButton: {
  //   backgroundColor: "#E7E7E7",
  //   borderRadius: "15px 15px 0px 0px",
  //   opacity: "100%",
  //   border: "1px solid #C8C8C8",
  //   fontWeight: 700,
  // },
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

type ClassIndex = {
  id: number;
  name: string;
  facilitator_id: number;
};

type FamilyTableRow = Pick<
  FamilyListResponse,
  | DefaultFieldKey.CURRENT_CLASS
  | DefaultFieldKey.EMAIL
  | DefaultFieldKey.ENROLLED
  | DefaultFieldKey.ID
  | DefaultFieldKey.PHONE_NUMBER
  | DefaultFieldKey.PREFERRED_CONTACT
  | DefaultFieldKey.NUM_CHILDREN
  | DefaultFieldKey.STATUS
> & {
  [DefaultFieldKey.FIRST_NAME]: string;
  [DefaultFieldKey.LAST_NAME]: string;
  // [key: number]: string | number; // dynamic fields
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
  // const { parentDynamicFields } = useContext(DynamicFieldsContext);
  const [tab, setTab] = useState<number>(0);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [classes, setClasses] = useState<ClassIndex[]>([]);
  const [classesData, setClassesData] = useState(new Map<number, ClassInfo>());
  const [currentSessionId, setCurrentSessionId] = useState<number>();
  const [displayRegDialog, setDisplayRegDialog] = useState(false);
  const styles = useStyles();

  const handleChangeClasses = async (id: number) => {
    const classesInSession = await SessionAPI.getClasses(id);
    setClasses(classesInSession);

    const classesMap = new Map<number, ClassInfo>();

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

  const getTableRowsData = (classData: ClassInfo): FamilyTableRow[] => {
    const tableRows = classData.families.map(({ parent, ...args }) => {
      const familyRow: FamilyTableRow = {
        [DefaultFieldKey.FIRST_NAME]: parent.first_name,
        [DefaultFieldKey.LAST_NAME]: parent.last_name,
        ...args,
      };
      return familyRow;
    });
    return tableRows;
  };

  const getTableRows = (): FamilyTableRow[] => {
    if (tab === 0) {
      let allClassesData: FamilyTableRow[] = [];
      classesData.forEach((classData) => {
        allClassesData = allClassesData.concat(getTableRowsData(classData));
      });
      return allClassesData;
    }
    const classData = classesData.get(tab);
    if (!classData) {
      return [];
    }
    return getTableRowsData(classData);
  };

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
            // className={styles.tabs}
          >
            {/* eslint-disable react/jsx-props-no-spreading */}
            <Tab value={0} label="All Classes" {...tabProps(0)} />
            {classes.map((classInfo) => (
              /* eslint-disable react/jsx-props-no-spreading */
              <Tab
                value={classInfo.id}
                key={classInfo.id}
                label={classInfo.name}
                {...tabProps(classInfo.id)}
              />
            ))}
            {/* <Button variant="text" className={styles.tabButton}>
              <Add />
            </Button> */}
          </Tabs>
          <Box flexGrow={1} className={styles.borderBottom} />
        </AppBar>
        <TabPanel key="all" value={tab} index={0}>
          <SessionTable families={getTableRows()} />
        </TabPanel>
        {classes.map((classInfo) => (
          <TabPanel key={classInfo.id} value={tab} index={classInfo.id}>
            <SessionTable families={getTableRows()} />
          </TabPanel>
        ))}
      </Box>
    </>
  );
};

export default Sessions;
