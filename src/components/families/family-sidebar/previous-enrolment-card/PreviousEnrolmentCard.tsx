import React, { useEffect } from "react";

import {
  Box,
  Collapse,
  Divider,
  IconButton,
  Typography,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";

import { EnrolmentResponse } from "api/types";
import StatusChip from "components/common/status-chip/StatusChip";
import { Student } from "types";

import SidebarCard from "../sidebar-card";
import useStyles from "./styles";

type Props = {
  enrolment: EnrolmentResponse;
  students: Student[];
};

const PreviousEnrolmentCard = ({ enrolment, students }: Props) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    setExpanded(false);
  }, [enrolment]);

  return (
    <SidebarCard>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box className={classes.headingContainer}>
          <Typography variant="body2">
            <b>{enrolment.session.name}</b>
          </Typography>
        </Box>
        <Divider className={classes.divider} orientation="vertical" flexItem />
        <Box className={classes.headingContainer}>
          <Typography variant="body2">
            <b>
              {enrolment.enrolled_class
                ? enrolment.enrolled_class.name
                : "Not Assigned"}
            </b>
          </Typography>
        </Box>
        <Divider
          classes={{ root: classes.divider }}
          orientation="vertical"
          flexItem
        />
        <StatusChip className={classes.statusChip} status={enrolment.status} />
        <IconButton
          aria-expanded={expanded}
          aria-label="show students"
          className={`${classes.expandButton} ${
            expanded && classes.expandButtonOpen
          }`}
          onClick={handleExpandClick}
          size="small"
        >
          <ExpandMore />
        </IconButton>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <div className={classes.content}>
          {students
            .filter((student) => enrolment.students.includes(student.id))
            .map((student) => (
              <Typography key={student.id} variant="body2">
                {student.first_name} {student.last_name}
              </Typography>
            ))}
        </div>
      </Collapse>
    </SidebarCard>
  );
};

export default PreviousEnrolmentCard;
