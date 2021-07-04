import React from "react";

import { Box, AppBar, Tabs, Tab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { ClassListResponse } from "../../../api/types";

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
};

const SessionDetailView = ({
  classes,
  classDefaultView,
  classTabIndex,
  onChangeClassTabIndex,
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
