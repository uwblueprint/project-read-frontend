import React, { useState, ReactNode } from "react";

import { Box, Divider, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@material-ui/icons";

import StatusChip from "components/common/status-chip/StatusChip";
import EnrolmentStatus from "constants/EnrolmentStatus";

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.palette.backgroundSecondary.default,
  },
  content: {
    "& .MuiTypography-body2": {
      color: theme.palette.text.secondary,
      fontSize: 12,
      fontWeight: 500,
    },
  },
  session: {
    "& .MuiTypography-body2": {
      fontWeight: 700,
    },
  },
  days: {
    "& .MuiTypography-body2": {
      fontWeight: 700,
      color: "#0052CC", // not sure if this colour is used anywhere else in the app, should add to theme if yes (taken from figma)
    },
  },
  divider: {
    padding: "0.5px",
    margin: theme.spacing(1),
    background: theme.palette.text.secondary,
  },
}));

type Props = {
  session: ReactNode;
  days: ReactNode;
  status: EnrolmentStatus;
  students: any; // change this to the right thing
};

const FamilySidebarEnrolmentCard = ({
  session,
  days,
  status,
  students,
}: Props) => {
  // add students
  const [showStudents, setShowStudents] = useState(false);
  const classes = useStyles();
  const tempStudents = [
    "Mary Wells",
    "Lebron James",
    "Kyle Lowry",
    "North West",
  ]; // to be replaced with students

  return (
    <Box
      onClick={() => setShowStudents(!showStudents)}
      className={classes.card}
      borderRadius={4}
      marginBottom={1.5}
      paddingX={2}
      paddingY={1.5}
    >
      <Box display="flex" flexDirection="row" alignItems="center">
        {console.log(session)}
        <div className={classes.session}>{session}</div>
        <Divider className={classes.divider} orientation="vertical" flexItem />
        <div className={classes.days}>{days}</div>
        <Divider
          classes={{ root: classes.divider }}
          orientation="vertical"
          flexItem
        />
        <StatusChip status={status} />
        <Box
        //   alignSelf="flex-end" // this isn't working -- must be end of box
        >
          {showStudents ? (
            <KeyboardArrowUpRounded />
          ) : (
            <KeyboardArrowDownRounded />
          )}
        </Box>
      </Box>
      {showStudents ? ( // this moves kind of annoyingly
        <>
          <Box>
            {tempStudents.map((student) => (
              <Typography key={student} variant="body2">
                {student}
              </Typography>
            ))}
            {
              console.log(students) // remove this to test with a better sample once database is updated
            }
          </Box>
        </>
      ) : null}
    </Box>
  );
};

export default FamilySidebarEnrolmentCard;
