import React from "react";

import { Box, Divider, Typography } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import { makeStyles } from "@material-ui/core/styles";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@material-ui/icons";

import { EnrolmentResponse } from "api/types";
import StatusChip from "components/common/status-chip/StatusChip";
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
      marginTop: 4,
      marginBottom: 4,
    },
  },
  bold: {
    "& .MuiTypography-body2": {
      fontWeight: 700,
    },
  },
  divider: {
    padding: "0.5px",
    margin: theme.spacing(1),
    background: theme.palette.text.secondary,
  },
}));

type Props = {
  enrolment: EnrolmentResponse;
  students: Student[];
};

const FamilySidebarEnrolmentCard = ({ enrolment, students }: Props) => {
  const classes = useStyles();

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Box
      onClick={handleExpandClick}
      className={classes.card}
      borderRadius={4}
      marginBottom={1.5}
      paddingX={2}
      paddingY={1.5}
    >
      <Box display="flex" flexDirection="row" alignItems="center">
        <div className={classes.bold}>
          <Typography variant="body2">{enrolment.session.name}</Typography>
        </div>
        <Divider className={classes.divider} orientation="vertical" flexItem />
        <div className={classes.bold}>
          <Typography variant="body2">
            {enrolment.enrolled_class
              ? enrolment.enrolled_class.name
              : "Not Assigned"}
          </Typography>
        </div>

        <Divider
          classes={{ root: classes.divider }}
          orientation="vertical"
          flexItem
        />
        <StatusChip status={enrolment.status} />
        <Box>
          {expanded ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
        </Box>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box>
          <div className={classes.content}>
            {students
              .filter((student) => enrolment.students.includes(student.id))
              .map((student) => (
                <Typography key={student.id} variant="body2">
                  {student.first_name} {student.last_name}
                </Typography>
              ))}
          </div>
        </Box>
      </Collapse>
    </Box>
  );
};

export default FamilySidebarEnrolmentCard;
