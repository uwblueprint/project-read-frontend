import React, { useContext } from "react";
import { makeStyles, TextField, Typography } from "@material-ui/core";
import { FieldsContext } from "../../context/fields";

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
      {parentFields.map((value) => (
        <div>
          <TextField
            label={value.name}
            value={formFields[value.id]}
            onChange={createChangeHandler(value.id)}
            variant="outlined"
            className={classes.formField}
          />
        </div>
      ))}
    </>
  );
}

export default RegistrationForm;
