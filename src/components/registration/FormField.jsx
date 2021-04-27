import React from "react";
import { makeStyles, MenuItem, TextField } from "@material-ui/core";
import PropTypes from "prop-types";
import QuestionTypes from "../../constants/QuestionTypes";

const useStyles = makeStyles((theme) => ({
  formField: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    width: 328,
  },
}));

function FormField({ field, initialValue, onChange }) {
  const classes = useStyles();

  switch (field.question_type) {
    case QuestionTypes.MULTIPLE_CHOICE:
      return (
        <TextField
          id="select"
          select
          label={field.name}
          value={initialValue}
          onChange={onChange}
          variant="outlined"
          className={classes.formField}
        >
          <MenuItem value="">None</MenuItem>
        </TextField>
      );
    case QuestionTypes.TEXT:
      return (
        <TextField
          label={field.name}
          value={initialValue}
          onChange={onChange}
          variant="outlined"
          className={classes.formField}
        />
      );
    default:
      return <></>;
  }
}

FormField.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
    question_type: PropTypes.string,
  }).isRequired,
  initialValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FormField;
