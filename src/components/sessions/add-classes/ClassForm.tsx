import React, { useContext } from "react";

import {
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  Theme,
  Typography,
} from "@material-ui/core";
import { Add, RemoveCircle } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

import { ClassListRequest } from "api/types";
import FormRow from "components/common/form-row";
import FieldVariant from "constants/FieldVariant";
import QuestionType from "constants/QuestionType";
import { UsersContext } from "context/UsersContext";

import DaysPicker from "./DaysPicker";

// unique identifier for children form components
let CLASS_COUNTER = 1;

const denseStyles = () => ({
  addButton: {
    marginBottom: 24,
  },
  roleLabel: {
    fontSize: 14,
    width: 112,
  },
  rowContainer: {
    height: 32,
  },
});

const useStyles = makeStyles<Theme, Pick<Props, "dense">>(() => ({
  addButton: ({ dense }) => ({
    marginBottom: 48,
    marginLeft: 32,
    marginTop: 10,
    paddingLeft: 12,
    paddingRight: 12,
    ...(dense && denseStyles().addButton),
  }),
  addButtonIcon: {
    marginRight: 8,
  },
  deleteButton: {
    height: 16,
    width: 16,
  },
  rowContainer: ({ dense }) => ({
    alignItems: "center",
    display: "flex",
    height: 56,
    ...(dense && denseStyles().rowContainer),
  }),
}));

export const generateKey = (): number => {
  let key = 0;
  key = CLASS_COUNTER;
  CLASS_COUNTER += 1;
  return key;
};

export type ClassFormData = ClassListRequest & { index: number };

const defaultClassData: ClassListRequest = {
  name: "",
  days: [],
  location: "",
  facilitator: null,
};

type Props = {
  dense: boolean;
  onChange: (classesData: ClassFormData[]) => void;
  classesData: ClassFormData[];
};

const ClassForm = ({ dense, onChange, classesData }: Props) => {
  const classes = useStyles({ dense });
  const { users } = useContext(UsersContext);

  const onAddClass = (): void => {
    onChange([...classesData, { ...defaultClassData, index: generateKey() }]);
  };

  const onUpdateClass = (index: number, data: ClassListRequest): void => {
    const classesObjs = [...classesData];
    classesObjs[index] = { ...classesObjs[index], ...data };
    onChange([...classesObjs]);
  };

  const onDeleteClass = (index: number): void => {
    const classesObjs = classesData;
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
    onChange(classesObjs);
  };

  console.log(classesData);

  return (
    <Box display="flex">
      <Box alignSelf="center" width="100%">
        {classesData.map((classData, i) => (
          <Box key={classData.index} display="flex" marginBottom={1}>
            <Box className={classes.rowContainer} minWidth={32}>
              {classesData.length > 1 && (
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
                id="session-name"
                label="Name"
                questionType={QuestionType.TEXT}
                variant={FieldVariant.COMPACT}
              >
                <OutlinedInput
                  autoComplete="new-password" // disable autocomplete
                  className={classes.input}
                  fullWidth
                  id="classname"
                  placeholder="Class name"
                  onChange={(e) =>
                    onUpdateClass(i, { ...classData, name: e.target.value })
                  }
                  value={classData.name}
                />
              </FormRow>
              <FormRow
                id="session-location"
                label="Location"
                questionType={QuestionType.TEXT}
                variant={FieldVariant.COMPACT}
              >
                <OutlinedInput
                  autoComplete="new-password" // disable autocomplete
                  className={classes.input}
                  fullWidth
                  id="location"
                  placeholder="Location"
                  onChange={(e) =>
                    onUpdateClass(i, { ...classData, location: e.target.value })
                  }
                  value={classData.location}
                />
              </FormRow>
              <DaysPicker
                days={classData.days}
                onChange={(days) => {
                  onUpdateClass(i, { ...classData, days });
                }}
              />
              <FormRow
                id="class-facilitator"
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
                  <MenuItem value="" className={classes.menuItem}>
                    None
                  </MenuItem>
                  {users?.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.first_name} {option.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormRow>
              {i < classesData.length - 1 && (
                <Box paddingY={2}>
                  <Divider />
                </Box>
              )}
            </Box>
          </Box>
        ))}
        <Button
          onClick={onAddClass}
          className={classes.addButton}
          size={dense ? "small" : "medium"}
          variant="outlined"
        >
          <Add fontSize="small" className={classes.addButtonIcon} />
          Add class
        </Button>
      </Box>
    </Box>
  );
};

export default ClassForm;
