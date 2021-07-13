import React from "react";

import DateInput from "components/common/date-input";
import SelectInput from "components/common/inputs/SelectInput";
import TextInput from "components/common/inputs/TextInput";
import QuestionTypes from "constants/QuestionTypes";
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
    case QuestionTypes.TEXT:
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
    case QuestionTypes.MULTIPLE_CHOICE:
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
    case QuestionTypes.DATE:
      return (
        <DateInput
          id={`${field.role} ${field.name}`}
          inputWidth={FORM_FIELD_WIDTH}
          label={field.name}
          onChange={onChange}
          testId={`${field.role} ${field.name}`}
          value={value}
        />
      );
    default:
      return null;
  }
};
export default Field;
