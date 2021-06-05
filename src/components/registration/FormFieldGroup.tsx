import React, { useEffect } from "react";
import { Box, MenuItem, TextField } from "@material-ui/core";
import QuestionTypes from "../../constants/QuestionTypes";
import { DynamicField } from "../../types";
import useFormFields, {
  DefaultFormField,
  FormFieldData,
} from "../../hooks/useFormFields";

const FORM_FIELD_WIDTH = 328;

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
      {fields.map((field: DefaultFormField | DynamicField) => (
        <Box
          key={`${field.role} ${field.name}`}
          marginY={2}
          width={FORM_FIELD_WIDTH}
        >
          {/* hidden input to disable autocomplete: https://gist.github.com/niksumeiko/360164708c3b326bd1c8#gistcomment-3716208 */}
          <Box display="none" aria-hidden="true">
            <input tabIndex={-1} />
          </Box>
          <TextField
            id={`${field.role} ${field.name}`}
            select={field.question_type === QuestionTypes.MULTIPLE_CHOICE}
            label={field.name}
            value={formFieldData[field.id]}
            onChange={onFormFieldDataChange(field.id)}
            variant="outlined"
            fullWidth
            inputProps={{
              autoComplete: "new-password", // disable autocomplete
              "aria-label": `${field.role} ${field.name}`,
              "data-testid": `${field.role} ${field.name}`,
            }}
          >
            {field.question_type === QuestionTypes.MULTIPLE_CHOICE &&
              field.options.map((option: string) => (
                <MenuItem value={option}>{option}</MenuItem>
              ))}
          </TextField>
        </Box>
      ))}
    </div>
  );
};

export default FormFieldGroup;
