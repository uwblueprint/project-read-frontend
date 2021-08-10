import React from "react";

import {
  Box,
  Checkbox,
  Chip,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@material-ui/core";
import moment from "moment";

import DateInput from "components/common/date-input";
import FormRow from "components/common/form-row";
import FieldVariant from "constants/FieldVariant";
import QuestionType from "constants/QuestionType";
import StudentRole from "constants/StudentRole";
import { DefaultField, DynamicField } from "types";

import useStyles from "./styles";

type Props = {
  dense?: boolean;
  field: (DefaultField & { role: StudentRole }) | DynamicField;
  index?: number | null;
  isEditing: boolean;
  onChange: (value: string) => void;
  value: string;
  variant?: FieldVariant;
};

const defaultProps = {
  dense: false,
  index: null,
  variant: FieldVariant.DEFAULT,
};

const Field = ({
  dense,
  field,
  index,
  isEditing,
  onChange,
  value,
  variant,
}: Props) => {
  const classes = useStyles({ dense });
  const id = `${field.role} ${index || ""} ${field.name} `;
  const compact = variant === FieldVariant.COMPACT;
  const valueArray: string[] = value.split("\n");
  const valueString: string = valueArray.join(", ");

  if (!isEditing) {
    return (
      <Box display="flex" paddingY={1}>
        <Box minWidth={144} paddingRight={2}>
          <Typography variant="body2">
            <b>{field.name}</b>
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2">{valueString}</Typography>
        </Box>
      </Box>
    );
  }

  const dynamicOptions = [...valueArray].filter(
    (val) => val && !field.options.includes(val)
  );

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
              value={valueString}
            />
          ),
          [QuestionType.SELECT]: (
            <Select
              aria-label={field.name}
              className={classes.input}
              displayEmpty
              fullWidth
              inputProps={{ "data-testid": id, className: classes.select }}
              labelId={id}
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              }}
              onChange={(e) => onChange(e.target.value as string)}
              value={valueString}
              variant="outlined"
            >
              <MenuItem value="" className={classes.menuItem}>
                <span className={classes.selectPlaceholder}>
                  {compact ? field.name : "Select"}
                </span>
              </MenuItem>
              {valueString && !field.options.includes(valueString) && (
                <MenuItem
                  key={valueString}
                  value={valueString}
                  className={classes.menuItem}
                >
                  {valueString}
                </MenuItem>
              )}
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
          [QuestionType.MULTIPLE_SELECT]: (
            <Select
              aria-label={field.name}
              className={classes.input}
              displayEmpty
              fullWidth
              inputProps={{
                "data-testid": id,
                className: classes.select,
              }}
              labelId={id}
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              }}
              multiple
              onChange={(e) =>
                onChange((e.target.value as string[]).join("\n"))
              }
              renderValue={(val) => {
                const values = val as string[];
                if (!values.length) {
                  return (
                    <span className={classes.selectPlaceholder}>
                      {compact ? field.name : "Select"}
                    </span>
                  );
                }
                return (values as string[]).map((selectedOption) => (
                  <Chip
                    label={selectedOption}
                    className={classes.multipleSelectValueChip}
                  />
                ));
              }}
              value={value.length ? value.split("\n") : []}
              variant="outlined"
            >
              {field.options.concat(dynamicOptions).map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  className={classes.menuItem}
                >
                  <Checkbox
                    checked={valueArray.includes(option)}
                    color="primary"
                  />
                  {option}
                </MenuItem>
              ))}
            </Select>
          ),
          // there are no date dynamic fields, so array/string values don't
          // need to be handled here
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
