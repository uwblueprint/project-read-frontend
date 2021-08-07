import React, { useState } from "react";

import { Box, Divider, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@material-ui/icons";

import StatusChip from "components/common/status-chip/StatusChip";
import EnrolmentStatus from "constants/EnrolmentStatus";
import { Student } from "types";

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
  session: string;
  days: string;
  status: EnrolmentStatus;
  studentIDs: number[];
  students: Student[];
};

const FamilySidebarEnrolmentCard = ({
  session,
  days,
  status,
  studentIDs,
  students,
}: Props) => {
  const [showStudents, setShowStudents] = useState(false);
  const classes = useStyles();

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
        <div className={classes.session}>
          <Typography variant="body2">{session}</Typography>
        </div>
        <Divider className={classes.divider} orientation="vertical" flexItem />
        <div className={classes.days}>
          <Typography variant="body2">{days}</Typography>
        </div>

        <Divider
          classes={{ root: classes.divider }}
          orientation="vertical"
          flexItem
        />
        <StatusChip status={status} />
        <Box>
          {showStudents ? (
            <KeyboardArrowUpRounded />
          ) : (
            <KeyboardArrowDownRounded />
          )}
        </Box>
      </Box>
      {showStudents ? (
        <Box>
          {students
            .filter((student) => studentIDs.includes(student.id))
            .map((student) => (
              <Typography key={student.id} variant="body2">
                {student.first_name} {student.last_name}
              </Typography>
            ))}
        </Box>
      ) : null}
    </Box>
  );
};

export default FamilySidebarEnrolmentCard;
