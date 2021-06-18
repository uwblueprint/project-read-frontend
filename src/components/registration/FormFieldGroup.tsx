import React, { useEffect } from "react";
import QuestionTypes from "../../constants/QuestionTypes";
import { DynamicField } from "../../types";
import useFormFields, {
  DefaultFormField,
  FormFieldData,
} from "../../hooks/useFormFields";
import Select from "../common/Select";
import TextInput from "../common/TextInput";

type FormFieldGroupProps = {
  fields: DefaultFormField[] | DynamicField[];
  onChange: (data: FormFieldData) => void;
  testId: string;
};

const FormFieldGroup = ({ testId, fields, onChange }: FormFieldGroupProps) => {
  const { formFieldData, onFormFieldDataChange } = useFormFields(fields);

  useEffect(() => {
    onChange(formFieldData);
  }, [formFieldData]);

  return (
    <div data-testid={testId}>
      {fields.map((field: DefaultFormField | DynamicField) => {
        switch (field.question_type) {
          case QuestionTypes.TEXT:
            return (
              <TextInput
                key={`${field.role} ${field.name}`}
                id={`${field.role} ${field.name}`}
                label={field.name}
                value={formFieldData[field.id]}
                onChange={(value) => onFormFieldDataChange(field.id, value)}
                testId={`${field.role} ${field.name}`}
              />
            );
          case QuestionTypes.MULTIPLE_CHOICE:
            return (
              <Select
                key={`${field.role} ${field.name}`}
                id={`${field.role} ${field.name}`}
                label={field.name}
                value={formFieldData[field.id]}
                onChange={(value) => onFormFieldDataChange(field.id, value)}
                options={field.options}
                testId={`${field.role} ${field.name}`}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default FormFieldGroup;
