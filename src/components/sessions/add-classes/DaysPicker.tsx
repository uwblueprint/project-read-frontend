import React from "react";

import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import FormRow from "components/common/form-row";
import FieldVariant from "constants/FieldVariant";
import QuestionType from "constants/QuestionType";
import { DaysOfWeek } from "types";

const DAYS_IN_WEEK = [
  {
    label: "Mon",
    value: DaysOfWeek.Monday,
  },
  {
    label: "Tue",
    value: DaysOfWeek.Tuesday,
  },
  {
    label: "Wed",
    value: DaysOfWeek.Wednesday,
  },
  {
    label: "Thu",
    value: DaysOfWeek.Thursday,
  },
  {
    label: "Fri",
    value: DaysOfWeek.Friday,
  },
  {
    label: "Sat",
    value: DaysOfWeek.Saturday,
  },
  {
    label: "Sun",
    value: DaysOfWeek.Sunday,
  },
];

type Props = {
  days: DaysOfWeek[];
  onChange: (days: DaysOfWeek[]) => void;
};

const DaysPicker = ({ days, onChange }: Props) => {
  const onUpdateDate = (
    e: React.MouseEvent<HTMLElement>,
    newDays: DaysOfWeek[]
  ) => {
    if (newDays.length) {
      onChange(newDays);
    }
  };

  return (
    <FormRow
      id="session-dates"
      label="Dates"
      questionType={QuestionType.MULTIPLE_SELECT}
      variant={FieldVariant.COMPACT}
    >
      <ToggleButtonGroup
        onChange={onUpdateDate}
        value={days}
        aria-label="Select dates of the week"
      >
        {DAYS_IN_WEEK.map((day) => (
          <ToggleButton value={day.value} key={day.label}>
            {day.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </FormRow>
  );
};

export default DaysPicker;
