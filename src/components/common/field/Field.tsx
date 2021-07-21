import React from "react";

import {
  Box,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import moment from "moment";

import DateInput from "components/common/date-input";
import FormRow from "components/common/form-row";
import FieldVariant from "constants/FieldVariant";
import QuestionType from "constants/QuestionType";
import StudentRole from "constants/StudentRole";
import { DefaultField, DynamicField } from "types";

const useStyles = makeStyles(() => ({
  selectPlaceholder: {
    color: "rgba(0, 0, 0, 0.38)",
  },
}));

type Props = {
  field: (DefaultField & { role: StudentRole }) | DynamicField;
  isEditing: boolean;
  onChange: (value: string) => void;
  variant?: FieldVariant;
  value: string;
};

const defaultProps = {
  variant: FieldVariant.DEFAULT,
};

const Field = ({ field, isEditing, onChange, value, variant }: Props) => {
  const classes = useStyles();
  const id = `${field.role} ${field.name}`;

  if (!isEditing) {
    return (
      <Box display="flex" paddingY={1}>
        <Box minWidth={144} paddingRight={2}>
          <Typography variant="body2">
            <b>{field.name}</b>
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2">{value}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <FormRow
      id={id}
      label={field.name}
      questionType={field.question_type}
      variant={variant}
    >
      {
        {
          [QuestionType.TEXT]: (
            <OutlinedInput
              autoComplete="new-password" // disable autocomplete
              fullWidth
              id={id}
              inputProps={{ "data-testid": id }}
              placeholder={variant === FieldVariant.COMPACT ? field.name : ""}
              onChange={(e) => onChange(e.target.value)}
              value={value}
            />
          ),
          [QuestionType.MULTIPLE_CHOICE]: (
            <Select
              aria-label={field.name}
              displayEmpty
              fullWidth
              inputProps={{ "data-testid": id }}
              labelId={id}
              onChange={(e) => onChange(e.target.value as string)}
              value={value}
              variant="outlined"
            >
              <MenuItem value="">
                {variant === FieldVariant.COMPACT ? (
                  <span className={classes.selectPlaceholder}>
                    {field.name}
                  </span>
                ) : (
                  "Select"
                )}
              </MenuItem>
              {field.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          ),
          [QuestionType.DATE]: (
            <DateInput
              id={id}
              onChange={(val) =>
                onChange(val ? moment(val).format("YYYY-MM-DD") : "")
              }
              placeholder={variant === FieldVariant.COMPACT ? field.name : ""}
              testId={`${field.role} ${field.name}`}
              value={value === "" ? null : moment(value, "YYYY-MM-DD").toDate()}
            />
          ),
        }[field.question_type]
      }
    </FormRow>
  );
};

Field.defaultProps = defaultProps;

export default Field;
