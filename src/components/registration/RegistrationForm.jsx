import React, { useContext } from "react";
import { makeStyles, MenuItem, TextField, Typography } from "@material-ui/core";
import { FieldsContext } from "../../context/fields";
import QuestionTypes from "../../constants/QuestionTypes";

const useStyles = makeStyles((theme) => ({
  formField: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    width: 328,
  },
}));

function useFormFields(initialValues) {
  const [formFields, setFormFields] = React.useState(initialValues);
  const createChangeHandler = (key) => (e) => {
    const { value } = e.target;
    setFormFields((prev) => ({ ...prev, [key]: value }));
  };
  return { formFields, createChangeHandler };
}

function RegistrationForm() {
  const classes = useStyles();
  const { parentFields } = useContext(FieldsContext);
  const { formFields, createChangeHandler } = useFormFields(
    Object.assign({}, ...parentFields.map((field) => ({ [field.id]: "" })))
  );

  return (
    <>
      <Typography>Currently enrolling a new family</Typography>
      {parentFields.map((parentField) => {
        switch (parentField.question_type) {
          case QuestionTypes.MULTIPLE_CHOICE:
            return (
              <div>
                <TextField
                  id="select"
                  label={parentField.name}
                  value={formFields[parentField.id]}
                  onChange={createChangeHandler(parentField.id)}
                  variant="outlined"
                  className={classes.formField}
                  select
                >
                  <MenuItem value="option">Option</MenuItem>
                </TextField>
              </div>
            );
          case QuestionTypes.TEXT:
            return (
              <div>
                <TextField
                  label={parentField.name}
                  value={formFields[parentField.id]}
                  onChange={createChangeHandler(parentField.id)}
                  variant="outlined"
                  className={classes.formField}
                />
              </div>
            );
          default:
            return <></>;
        }
      })}
    </>
  );
}

export default RegistrationForm;
