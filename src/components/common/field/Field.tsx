import React from "react";

import {
  Box,
  MenuItem,
  OutlinedInput,
  Select,
  Theme,
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

const denseStyles = (theme: Theme) => ({
  input: {
    backgroundColor: theme.palette.background.paper,
    fontSize: 14,
    paddingBottom: 0,
    paddingTop: 0,
    height: 32,
  },
  label: {
    fontSize: 14,
  },
  menuItem: {
    fontSize: 14,
    height: 32,
  },
  select: {
    paddingBottom: 8,
    paddingTop: 8,
  },
});

const useStyles = makeStyles<Theme, Pick<Props, "dense">>((theme) => ({
  input: ({ dense }) => (dense ? denseStyles(theme).input : {}),
  label: ({ dense }) => (dense ? denseStyles(theme).label : {}),
  menuItem: ({ dense }) => (dense ? denseStyles(theme).menuItem : {}),
  select: ({ dense }) => (dense ? denseStyles(theme).select : {}),
  selectPlaceholder: {
    color: "rgba(0, 0, 0, 0.38)",
  },
}));

type Props = {
  dense?: boolean;
  field: (DefaultField & { role: StudentRole }) | DynamicField;
  isEditing: boolean;
  onChange: (value: string) => void;
  value: string;
  variant?: FieldVariant;
};

const defaultProps = {
  dense: false,
  variant: FieldVariant.DEFAULT,
};

const Field = ({
  dense,
  field,
  isEditing,
  onChange,
  value,
  variant,
}: Props) => {
  const classes = useStyles({ dense });
  const id = `${field.role} ${field.name}`;

  const compact = variant === FieldVariant.COMPACT;

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
      dense={dense}
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
              className={classes.input}
              fullWidth
              id={id}
              inputProps={{ "data-testid": id }}
              placeholder={compact ? field.name : ""}
              onChange={(e) => onChange(e.target.value)}
              value={value}
            />
          ),
          [QuestionType.MULTIPLE_CHOICE]: (
            <Select
              aria-label={field.name}
              className={classes.input}
              displayEmpty
              fullWidth
              inputProps={{ "data-testid": id, className: classes.select }}
              labelId={id}
              onChange={(e) => onChange(e.target.value as string)}
              value={value}
              variant="outlined"
            >
              <MenuItem value="" className={classes.menuItem}>
                {compact ? (
                  <span className={classes.selectPlaceholder}>
                    {field.name}
                  </span>
                ) : (
                  "Select"
                )}
              </MenuItem>
              {field.options.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  className={classes.menuItem}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>
          ),
          [QuestionType.DATE]: (
            <DateInput
              dense={dense}
              id={id}
              onChange={(val) =>
                onChange(val ? moment(val).format("YYYY-MM-DD") : "")
              }
              placeholder={compact ? field.name : ""}
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
