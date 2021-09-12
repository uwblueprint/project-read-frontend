import React, { useState, useContext } from "react";

import {
  Box,
  Divider,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@material-ui/core";
import { RemoveCircle } from "@material-ui/icons";

import { ClassListRequest } from "api/types";
import AddButton from "components/common/add-button";
import FormRow from "components/common/form-row";
import FieldVariant from "constants/FieldVariant";
import QuestionType from "constants/QuestionType";
import { UsersContext } from "context/UsersContext";

import DaysPicker from "./DaysPicker";
import useStyles from "./styles";

// unique identifier for children form components
let CLASS_COUNTER = 1;

export const generateKey = (): number => {
  let key = 0;
  key = CLASS_COUNTER;
  CLASS_COUNTER += 1;
  return key;
};

export type ClassFormData = ClassListRequest & { index: number };

export const defaultClassData: ClassListRequest = {
  name: "",
  days: [],
  location: "",
  facilitator: null,
};

type Props = {
  classList: ClassListRequest[];
  onChangeClasses: (classes: ClassListRequest[]) => void;
};

const AddClasses = ({ classList, onChangeClasses }: Props) => {
  const classes = useStyles();
  const { users } = useContext(UsersContext);

  const classRequestToClassFormData = (
    classesData: ClassListRequest[]
  ): ClassFormData[] =>
    classesData.map((classData, i) => ({ ...classData, index: i }));

  const [classFormData, setClassFormData] = useState<ClassFormData[]>(
    classRequestToClassFormData(classList)
  );

  const handleChange = (classesData: ClassFormData[]) => {
    setClassFormData(classesData);
    const submitClassesData = classesData.map((classData) => {
      const { index, ...req } = classData;
      return req as ClassListRequest;
    });
    onChangeClasses(submitClassesData);
  };

  const onAddClass = (): void => {
    handleChange([
      ...classFormData,
      { ...defaultClassData, index: generateKey() },
    ]);
  };

  const onUpdateClass = (index: number, data: ClassListRequest): void => {
    const classesObjs = [...classFormData];
    classesObjs[index] = { ...classesObjs[index], ...data };
    handleChange([...classesObjs]);
  };

  const onDeleteClass = (index: number): void => {
    const classesObjs = classFormData;
    classesObjs.forEach((classObj, i) => {
      if (classObj.index === index) {
        // Remove the class from array of classes
        classesObjs.splice(i, 1);
      }
      if (classesObjs[i]) {
        // Reset the index of all classes
        classesObjs[i].index = i;
      }
    });
    CLASS_COUNTER = classesObjs.length;
    handleChange(classesObjs);
  };

  return (
    <div>
      <Box marginBottom={3}>
        <Box marginBottom={1}>
          <Typography variant="h3">Class information</Typography>
        </Box>
        <Typography variant="body2">
          New classes can be added after session creation as well.
        </Typography>
      </Box>
      <Box width={488}>
        <Box display="flex">
          <Box alignSelf="center" width="100%">
            {classFormData.map((classData, i) => (
              <Box key={classData.index} display="flex" marginBottom={1}>
                <Box className={classes.rowContainer} minWidth={32}>
                  {classFormData.length > 1 && (
                    <IconButton
                      aria-label="delete class"
                      onClick={() => onDeleteClass(classData.index)}
                      className={classes.deleteButton}
                    >
                      <RemoveCircle className={classes.deleteButton} />
                    </IconButton>
                  )}
                </Box>
                <Box flex="auto">
                  <Box marginBottom={2}>
                    <Typography variant="h4">
                      Class {classData.index + 1}
                    </Typography>
                  </Box>
                  <FormRow
                    id={`classname-${classData.index}`}
                    label="Name"
                    questionType={QuestionType.TEXT}
                    variant={FieldVariant.COMPACT}
                  >
                    <OutlinedInput
                      autoComplete="new-password" // disable autocomplete
                      className={classes.input}
                      fullWidth
                      id={`classname-${classData.index}`}
                      placeholder="Class name"
                      onChange={(e) =>
                        onUpdateClass(i, { ...classData, name: e.target.value })
                      }
                      value={classData.name}
                    />
                  </FormRow>
                  <Box marginBottom={2}>
                    <DaysPicker
                      days={classData.days}
                      onChange={(days) => {
                        onUpdateClass(i, { ...classData, days });
                      }}
                    />
                  </Box>
                  <FormRow
                    id={`location-${classData.index}`}
                    label="Location"
                    questionType={QuestionType.TEXT}
                    variant={FieldVariant.COMPACT}
                  >
                    <OutlinedInput
                      autoComplete="new-password" // disable autocomplete
                      className={classes.input}
                      fullWidth
                      id={`location-${classData.index}`}
                      placeholder="Location"
                      onChange={(e) =>
                        onUpdateClass(i, {
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
                    variant={FieldVariant.COMPACT}
                  >
                    <Select
                      aria-label="Class facilitator"
                      className={classes.input}
                      displayEmpty
                      fullWidth
                      labelId={`class ${classData.index}`}
                      onChange={(e) =>
                        onUpdateClass(i, {
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
                  {i < classFormData.length - 1 && (
                    <Box paddingY={2}>
                      <Divider />
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
            <Box marginBottom={6} marginTop={1} marginLeft={4}>
              <AddButton label="Add class" onClick={onAddClass} />
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default AddClasses;
