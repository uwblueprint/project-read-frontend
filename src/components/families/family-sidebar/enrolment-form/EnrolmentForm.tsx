import React from "react";

import {
  Box,
  InputBase,
  MenuItem,
  Select,
  Theme,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { enrolmentResponseToRequest } from "api/EnrolmentAPI";
import { EnrolmentRequest, EnrolmentResponse } from "api/types";
import FormRow from "components/common/form-row";
import StatusChip from "components/common/status-chip";
import EnrolmentStatus from "constants/EnrolmentStatus";
import QuestionType from "constants/QuestionType";

import ClassSelect from "./class-select";
import EnrolmentFormRow from "./enrolment-form-row";

const baseId = "enrolment-select";

const useStyles = makeStyles((theme: Theme) => ({
  input: {
    cursor: "pointer",
    height: 40,
    fontSize: 14,
    marginBottom: 4,
    marginTop: 4,
  },
  inputBackground: {
    backgroundColor: theme.palette.backgroundSecondary.default,
    borderRadius: 4,
  },
  select: {
    paddingBottom: 4,
    paddingTop: 4,
    paddingLeft: 4,
    paddingRight: 32,
    width: "100%",
  },
  statusChip: {
    cursor: "pointer",
  },
}));

type Props = {
  enrolment: EnrolmentResponse | null;
  onChange: (enrolment: EnrolmentRequest) => void;
};

const EnrolmentForm = ({ enrolment, onChange }: Props) => {
  const classes = useStyles();

  const SessionRow = () => (
    <EnrolmentFormRow
      id={`${baseId}-session`}
      label="Session"
      link={enrolment ? `/sessions/${enrolment.session}` : undefined}
    >
      <Box
        className={classes.inputBackground}
        marginY={0.25}
        paddingX={2}
        paddingY={1.25}
      >
        <Typography variant="body2">
          {enrolment ? enrolment.session.name : "Not enrolled"}
        </Typography>
      </Box>
    </EnrolmentFormRow>
  );

  if (enrolment === null) {
    return <SessionRow />;
  }

  return (
    <>
      <Box>
        <FormRow
          dense
          id={`${baseId}-status`}
          label="Status"
          questionType={QuestionType.MULTIPLE_CHOICE}
        >
          <Select
            input={<InputBase className={classes.input} />}
            labelId={`${baseId}-status`}
            onChange={(e) =>
              onChange({
                ...enrolmentResponseToRequest(enrolment),
                status: e.target.value as EnrolmentStatus,
              })
            }
            SelectDisplayProps={{ className: classes.select }}
            value={enrolment.status}
          >
            {Object.values(EnrolmentStatus)
              .filter((status) => status !== EnrolmentStatus.UNASSIGNED)
              .map((status) => (
                <MenuItem value={status}>
                  <StatusChip className={classes.statusChip} status={status} />
                </MenuItem>
              ))}
          </Select>
        </FormRow>
      </Box>
      <SessionRow />
      <EnrolmentFormRow
        id={`${baseId}-enrolled-class`}
        label="Class"
        link={`/sessions/${enrolment.session}/classes/${enrolment.enrolled_class}`}
      >
        <ClassSelect
          id={`${baseId}-enrolled-class`}
          onChange={(enrolled_class) =>
            onChange({
              ...enrolmentResponseToRequest(enrolment),
              enrolled_class,
            })
          }
          options={enrolment.session.classes}
          value={enrolment.enrolled_class?.id || null}
        />
      </EnrolmentFormRow>
      <EnrolmentFormRow id={`${baseId}-preferred-class`} label="Preferences">
        <ClassSelect
          id={`${baseId}-preferred-class`}
          onChange={(preferred_class) =>
            onChange({
              ...enrolmentResponseToRequest(enrolment),
              preferred_class,
            })
          }
          options={enrolment.session.classes}
          value={enrolment.preferred_class?.id || null}
        />
      </EnrolmentFormRow>
    </>
  );
};

export default EnrolmentForm;
