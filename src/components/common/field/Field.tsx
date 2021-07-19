import React from "react";

import moment from "moment";

import DateInput from "components/common/date-input";
import SelectInput from "components/common/inputs/SelectInput";
import TextInput from "components/common/inputs/TextInput";
import QuestionType from "constants/QuestionType";
import StudentRole from "constants/StudentRole";
import { DefaultField, DynamicField } from "types";

const FORM_FIELD_WIDTH = 328;

type Props = {
  field: (DefaultField & { role: StudentRole }) | DynamicField;
  onChange: (value: string) => void;
  value: string;
};

const Field = ({ field, onChange, value }: Props) => {
  switch (field.question_type) {
    case QuestionType.TEXT:
      return (
        <TextInput
          id={`${field.role} ${field.name}`}
          inputWidth={FORM_FIELD_WIDTH}
          label={field.name}
          onChange={onChange}
          testId={`${field.role} ${field.name}`}
          value={value}
        />
      );
    case QuestionType.MULTIPLE_CHOICE:
      return (
        <SelectInput
          id={`${field.role} ${field.name}`}
          inputWidth={FORM_FIELD_WIDTH}
          label={field.name}
          testId={`${field.role} ${field.name}`}
          onChange={onChange}
          options={field.options}
          value={value}
        />
      );
    case QuestionType.DATE:
      return (
        <DateInput
          id={`${field.role} ${field.name}`}
          inputWidth={FORM_FIELD_WIDTH}
          label={field.name}
          onChange={(val) =>
            onChange(val ? moment(val).format("YYYY-MM-DD") : "")
          }
          testId={`${field.role} ${field.name}`}
          value={value === "" ? null : moment(value, "YYYY-MM-DD").toDate()}
        />
      );
    default:
      return null;
  }
};
export default Field;
