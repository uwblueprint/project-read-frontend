import React, { useState } from "react";

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
import { User } from "types";
// import Field from "components/common/field";
// import FieldVariant from "constants/FieldVariant";

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
  roleLabel: ({ dense }) => ({
    width: 128,
    ...(dense && denseStyles().roleLabel),
  }),
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
  const facilitators = useState<User[]>([]);

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
              <Typography variant="body1">
                Class {classData.index + 1}
              </Typography>
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
              <Select
                aria-label="Facilitator"
                className={classes.input}
                displayEmpty
                fullWidth
                labelId="facilitator"
                onChange={(e) =>
                  onUpdateClass(i, {
                    ...classData,
                    facilitator: e.target.value,
                  })
                }
                value={classData.facilitator}
                variant="outlined"
              >
                <MenuItem value="" className={classes.menuItem}>
                  Select
                </MenuItem>
                {facilitators.options.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    className={classes.menuItem}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Select>
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
