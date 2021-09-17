import React, { useContext } from "react";

import { Box, MenuItem, OutlinedInput, Select } from "@material-ui/core";

import { ClassListRequest } from "api/types";
import FormRow from "components/common/form-row";
import FieldVariant from "constants/FieldVariant";
import QuestionType from "constants/QuestionType";
import { UsersContext } from "context/UsersContext";

import DaysPicker from "./DaysPicker";
import useStyles from "./styles";

export type ClassFormData = ClassListRequest & { index: number };

type Props = {
  classData: ClassFormData;
  classIndex: number;
  fieldVariant: FieldVariant;
  onUpdateClass: (index: number, data: ClassFormData) => void;
};

const AddClass = ({
  classData,
  classIndex,
  fieldVariant,
  onUpdateClass,
}: Props) => {
  const classes = useStyles();
  const { users } = useContext(UsersContext);

  return (
    <>
      <FormRow
        id={`classname-${classData.index}`}
        label="Name"
        questionType={QuestionType.TEXT}
        variant={fieldVariant}
      >
        <OutlinedInput
          autoComplete="new-password" // disable autocomplete
          className={classes.input}
          fullWidth
          id={`classname-${classData.index}`}
          placeholder="Class name"
          onChange={(e) =>
            onUpdateClass(classIndex, { ...classData, name: e.target.value })
          }
          value={classData.name}
        />
      </FormRow>
      <Box marginBottom={2}>
        <FormRow
          id={`classdays-${classData.index}`}
          label="Days"
          questionType={QuestionType.MULTIPLE_SELECT}
          variant={fieldVariant}
        >
          <DaysPicker
            days={classData.days}
            onChange={(days) => {
              onUpdateClass(classIndex, { ...classData, days });
            }}
          />
        </FormRow>
      </Box>
      <FormRow
        id={`location-${classData.index}`}
        label="Location"
        questionType={QuestionType.TEXT}
        variant={fieldVariant}
      >
        <OutlinedInput
          autoComplete="new-password" // disable autocomplete
          className={classes.input}
          fullWidth
          id={`location-${classData.index}`}
          placeholder="Location"
          onChange={(e) =>
            onUpdateClass(classIndex, {
              ...classData,
              location: e.target.value,
            })
          }
          value={classData.location}
        />
      </FormRow>
      <FormRow
        id={`class ${classData.index}`}
        label="Facilitator"
        questionType={QuestionType.SELECT}
        variant={fieldVariant}
      >
        <Select
          aria-label="Class facilitator"
          className={classes.input}
          displayEmpty
          fullWidth
          labelId={`class ${classData.index}`}
          onChange={(e) =>
            onUpdateClass(classIndex, {
              ...classData,
              facilitator: e.target.value as number,
            })
          }
          value={classData.facilitator || ""}
          variant="outlined"
        >
          <MenuItem value="" className={classes.selectPlaceholder}>
            Facilitator
          </MenuItem>
          {users?.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.first_name} {option.last_name}
            </MenuItem>
          ))}
        </Select>
      </FormRow>
    </>
  );
};

export default AddClass;
