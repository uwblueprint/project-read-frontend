import React from "react";

import { Box, InputLabel, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import SelectInput from "components/common/inputs/SelectInput";
import TextInput from "components/common/inputs/TextInput";
import QuestionTypes from "constants/QuestionTypes";
import StudentRole from "constants/StudentRole";
import { DefaultField, DynamicField } from "types";

const useStyles = makeStyles<Theme, Pick<Props, "dense">>(() => ({
  input: {
    fontSize: ({ dense }) => (dense ? 14 : 16),
    height: ({ dense }) => (dense ? 32 : 52),
  },
  label: {
    fontSize: ({ dense }) => (dense ? 14 : 16),
  },
}));

type Props = {
  dense: boolean;
  field: (DefaultField & { role: StudentRole }) | DynamicField;
  isEditing: boolean;
  onChange: (value: string) => void;
  value: string;
};

const Field = ({ dense, field, isEditing, onChange, value }: Props) => {
  const classes = useStyles({ dense });
  const id = `${field.role} ${field.name}`;

  if (!isEditing) {
    return (
      <Box display="flex" maxWidth="100%" paddingY={1}>
        <Box paddingRight={2} minWidth={144}>
          <Typography variant="body2">
            <b>{field.name}</b>
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2">
            {value.length ? value : "Not specified"}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      paddingY={dense ? "2px" : 1}
    >
      {field.question_type === QuestionTypes.TEXT && (
        // hidden input to disable autocomplete: https://gist.github.com/niksumeiko/360164708c3b326bd1c8#gistcomment-3716208
        <Box display="none" aria-hidden="true">
          <input aria-hidden="true" tabIndex={-1} />
        </Box>
      )}
      <Box paddingRight={2} minWidth={144}>
        <InputLabel className={classes.label} htmlFor={id} id={id}>
          {field.name}
        </InputLabel>
      </Box>
      <Box flexGrow={1} maxWidth={328}>
        {
          {
            [QuestionTypes.TEXT]: (
              <TextInput
                className={classes.input}
                id={id}
                onChange={onChange}
                testId={id}
                value={value}
              />
            ),
            [QuestionTypes.MULTIPLE_CHOICE]: (
              <SelectInput
                className={classes.input}
                id={id}
                label={field.name}
                testId={id}
                onChange={onChange}
                options={field.options}
                value={value}
              />
            ),
          }[field.question_type]
        }
      </Box>
    </Box>
  );
};

export default Field;
