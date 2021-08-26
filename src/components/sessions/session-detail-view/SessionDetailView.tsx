import React from "react";

import { Box, AppBar, Tabs, Tab, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";

import { ClassListResponse } from "api/types";

export const ALL_CLASSES_TAB_INDEX = 0;

const useStyles = makeStyles(() => ({
  appBar: {
    flexDirection: "row",
    backgroundColor: "inherit",
  },
  borderBottom: {
    borderBottom: "1px solid #C8C8C8",
    opacity: 0.7,
    backgroundColor: "inherit",
  },
  addButton: {
    backgroundColor: "#E7E7E7",
    border: "1px solid #C8C8C8",
    borderTopLeftRadius: "15px",
    borderTopRightRadius: "15px",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    minWidth: 45,
    opacity: 0.7,
  },
}));

const tabProps = (index: number) => ({
  id: `tab-${index}`,
  "aria-controls": `tabpanel-${index}`,
});

type Props = {
  classes: ClassListResponse[];
  classDefaultView: JSX.Element;
  classTabIndex: number;
  onChangeClassTabIndex: (tab: number) => void;
  onDialogOpen: () => void;
};

const SessionDetailView = ({
  classes,
  classDefaultView,
  classTabIndex,
  onChangeClassTabIndex,
  onDialogOpen,
}: Props) => {
  const styles = useStyles();

  return (
    <Box mt={4}>
      <AppBar position="static" className={styles.appBar}>
        <Tabs
          TabIndicatorProps={{ style: { backgroundColor: "inherit" } }}
          value={classTabIndex}
          onChange={(e, val) => onChangeClassTabIndex(val)}
          aria-label="Classes Tabs"
        >
          <Tab
            value={ALL_CLASSES_TAB_INDEX}
            label="All Classes"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...tabProps(0)}
          />
          {classes.map((classObj) => (
            <Tab
              value={classObj.id}
              key={classObj.id}
              label={classObj.name}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...tabProps(classObj.id)}
            />
          ))}
        </Tabs>
        <Button className={styles.addButton} onClick={onDialogOpen}>
          <AddIcon />
        </Button>
        <Box flexGrow={1} className={styles.borderBottom} />
      </AppBar>
      <div
        role="tabpanel"
        id={`tabpanel-${classTabIndex}`}
        aria-labelledby={`tab-${classTabIndex}`}
      >
        <Box pt={3}>{classDefaultView}</Box>
      </div>
    </Box>
  );
};

export default SessionDetailView;
