import React, { useState } from "react";

import {
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Add, RemoveCircle } from "@material-ui/icons";

import { ClassListRequest } from "api/types";
import FieldVariant from "constants/FieldVariant";

import AddClass, { ClassFormData } from "./AddClass";
import useStyles from "./styles";

// unique identifier for children form components
let CLASS_COUNTER = 1;

export const generateKey = (): number => {
  let key = 0;
  key = CLASS_COUNTER;
  CLASS_COUNTER += 1;
  return key;
};

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
                  <AddClass
                    key={classData.index}
                    classData={classData}
                    classIndex={i}
                    fieldVariant={FieldVariant.COMPACT}
                    onUpdateClass={onUpdateClass}
                  />
                </Box>
                {i < classFormData.length - 1 && (
                  <Box paddingY={2}>
                    <Divider />
                  </Box>
                )}
              </Box>
            ))}
            <Button
              onClick={onAddClass}
              className={classes.addButton}
              size="medium"
              variant="outlined"
            >
              <Add fontSize="small" className={classes.addButtonIcon} />
              Add class
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default AddClasses;
