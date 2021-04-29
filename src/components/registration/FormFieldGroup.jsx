import React, { useEffect, useState } from "react";
import { MenuItem, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import QuestionTypes from "../../constants/QuestionTypes";

const useStyles = makeStyles((theme) => ({
  formField: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    width: 328,
    display: "block",
  },
}));

function useFormFields(fields) {
  const [formFields, setFormFields] = useState(
    Object.assign({}, ...fields.map((field) => ({ [field.id]: "" })))
  );

  const createFieldChangeHandler = (key) => (e) => {
    const { value } = e.target;
    setFormFields((prev) => ({ ...prev, [key]: value }));
  };

  return { formFields, createFieldChangeHandler };
}

function FormFieldGroup({ fields, onChange }) {
  const classes = useStyles();
  const { formFields, createFieldChangeHandler } = useFormFields(
    fields,
    onChange
  );

  useEffect(() => {
    onChange(formFields);
  }, [formFields]);

  return (
    <>
      {fields.map((field) => (
        <TextField
          id={`${field.role} ${field.name}`}
          select={field.question_type === QuestionTypes.MULTIPLE_CHOICE}
          label={field.name}
          value={formFields[field.id]}
          onChange={createFieldChangeHandler(field.id)}
          variant="outlined"
          fullWidth
          className={classes.formField}
          inputProps={{
            autoComplete: "new-password",
            "aria-label": `${field.role} ${field.name}`,
          }}
        >
          {field.question_type === QuestionTypes.MULTIPLE_CHOICE && (
            <MenuItem value="">None</MenuItem>
          )}
        </TextField>
      ))}
    </>
  );
}

FormFieldGroup.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      name: PropTypes.string,
      question_type: PropTypes.string,
    }).isRequired
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FormFieldGroup;
