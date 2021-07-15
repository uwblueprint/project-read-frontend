import React from "react";

import { Typography } from "@material-ui/core";

import DateInput from "components/common/date-input";
import TextInput from "components/common/inputs/TextInput";

const FORM_FIELD_WIDTH = 328;

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
    <Typography variant="h2">Session information</Typography>
    <TextInput
      testId={TestId.NameInput}
      id="session-name"
      label="Name"
      value={sessionName}
      onChange={(name) => onChangeSessionName(name)}
      inputWidth={FORM_FIELD_WIDTH}
    />
    <DateInput
      id="start-date"
      label="Start date"
      value={startDate}
      onChange={(date) => onChangeStartDate(date)}
      inputWidth={FORM_FIELD_WIDTH}
    />
  </div>
);

export default SessionConfig;
