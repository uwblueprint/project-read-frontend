import React from "react";

import { Box, OutlinedInput, Typography } from "@material-ui/core";
import moment from "moment";

import DateInput from "components/common/date-input";
import FormRow from "components/common/form-row";
import QuestionType from "constants/QuestionType";

export enum TestId {
  NameInput = "name-input",
  SessionConfig = "session-config",
}

type Props = {
  sessionName: string;
  onChangeSessionName: (name: string) => void;
  startDate: string;
  onChangeStartDate: (date: string) => void;
};

const SessionConfig = ({
  sessionName,
  onChangeSessionName,
  startDate,
  onChangeStartDate,
}: Props) => (
  <div data-testid={TestId.SessionConfig}>
    <Box marginBottom={3}>
      <Typography variant="h3">Session information</Typography>
    </Box>
    <Box width={408}>
      <FormRow id="session-name" label="Name" questionType={QuestionType.TEXT}>
        <OutlinedInput
          autoComplete="new-password" // disable autocomplete
          fullWidth
          id="session-name"
          inputProps={{ "data-testid": TestId.NameInput }}
          onChange={(e) => onChangeSessionName(e.target.value)}
          value={sessionName}
        />
      </FormRow>
      <FormRow
        id="start-date"
        label="Start date"
        questionType={QuestionType.DATE}
      >
        <DateInput
          id="start-date"
          onChange={(val) =>
            onChangeStartDate(val ? moment(val).format("YYYY-MM-DD") : "")
          }
          value={
            startDate === "" ? null : moment(startDate, "YYYY-MM-DD").toDate()
          }
        />
      </FormRow>
    </Box>
  </div>
);

export default SessionConfig;
