import React from "react";
import StudentRole from "../../../constants/StudentRole";
import QuestionTypes from "../../../constants/QuestionTypes";
import { DefaultField, DynamicField } from "../../../types";
import SelectInput from "../inputs/SelectInput";
import TextInput from "../inputs/TextInput";

const FORM_FIELD_WIDTH = 328;

type Props = {
  field: (DefaultField & { role: StudentRole }) | DynamicField;
  value: string;
  onChange: (value: string) => void;
};

const FieldInput = ({ field, value, onChange }: Props) => {
  switch (field.question_type) {
    case QuestionTypes.TEXT:
      return (
        <TextInput
          id={`${field.role} ${field.name}`}
          label={field.name}
          value={value}
          onChange={onChange}
          inputWidth={FORM_FIELD_WIDTH}
          testId={`${field.role} ${field.name}`}
        />
      );
    case QuestionTypes.MULTIPLE_CHOICE:
      return (
        <SelectInput
          id={`${field.role} ${field.name}`}
          label={field.name}
          value={value}
          onChange={onChange}
          inputWidth={FORM_FIELD_WIDTH}
          testId={`${field.role} ${field.name}`}
          options={field.options}
        />
      );
    default:
      return null;
  }
};
export default FieldInput;
