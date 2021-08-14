import React from "react";

import {
  Box,
  Button,
  Divider,
  IconButton,
  Theme,
  Typography,
} from "@material-ui/core";
import { Add, RemoveCircle } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

import { StudentRequest } from "api/types";
import Field from "components/common/field";
import DefaultFieldKey from "constants/DefaultFieldKey";
import DefaultFields from "constants/DefaultFields";
import FieldVariant from "constants/FieldVariant";
import StudentRole from "constants/StudentRole";
import { DynamicField } from "types";

import StudentDynamicFields from "../student-dynamic-fields";
import { StudentFormData } from "../types";

const DENSE_FIELD_WIDTH = 224;

// unique identifier for children form components
let CHILD_KEY_COUNTER = 1;
let GUEST_KEY_COUNTER = 1;

const denseStyles = (isEditing: boolean) => ({
  addButton: {
    marginBottom: 24,
  },
  roleLabel: {
    fontSize: isEditing ? 14 : 15,
    width: isEditing ? 112 : "",
  },
  rowContainer: {
    height: 32,
  },
});

const useStyles = makeStyles<Theme, Pick<Props, "dense" | "isEditing">>(() => ({
  addButton: ({ dense, isEditing }) => ({
    marginBottom: 48,
    marginLeft: 32,
    marginTop: 10,
    paddingLeft: 12,
    paddingRight: 12,
    ...(dense && denseStyles(isEditing).addButton),
  }),
  addButtonIcon: {
    marginRight: 8,
  },
  deleteButton: {
    height: 16,
    width: 16,
  },
  roleLabel: ({ dense, isEditing }) => ({
    width: 128,
    ...(dense && denseStyles(isEditing).roleLabel),
  }),
  rowContainer: ({ dense, isEditing }) => ({
    alignItems: "center",
    display: "flex",
    height: 56,
    ...(dense && denseStyles(isEditing).rowContainer),
  }),
}));

export const generateKey = (
  role: StudentRole.CHILD | StudentRole.GUEST
): number => {
  let key = 0;
  if (role === StudentRole.CHILD) {
    key = CHILD_KEY_COUNTER;
    CHILD_KEY_COUNTER += 1;
  } else if (role === StudentRole.GUEST) {
    key = GUEST_KEY_COUNTER;
    GUEST_KEY_COUNTER += 1;
  }
  return key;
};

const defaultStudentData: StudentRequest = {
  [DefaultFieldKey.FIRST_NAME]: "",
  [DefaultFieldKey.LAST_NAME]: "",
  [DefaultFieldKey.DATE_OF_BIRTH]: null,
  information: {},
};

type Props = {
  dense: boolean;
  dynamicFields: DynamicField[];
  isEditing: boolean;
  onChange: (students: StudentFormData[]) => void;
  role: StudentRole.CHILD | StudentRole.GUEST;
  students: StudentFormData[];
};

const StudentForm = ({
  dense,
  dynamicFields,
  isEditing,
  onChange,
  role,
  students,
}: Props) => {
  const classes = useStyles({ dense, isEditing });
  const fieldProps = { dense, isEditing, variant: FieldVariant.COMPACT };

  const onAddStudent = (): void => {
    onChange([
      ...students,
      { ...defaultStudentData, index: generateKey(role) },
    ]);
  };

  const onUpdateStudent = (index: number, data: StudentRequest): void => {
    const studentsData = [...students];
    studentsData[index] = { ...studentsData[index], ...data };
    onChange([...studentsData]);
  };

  const onDeleteStudent = (index: number): void => {
    onChange(students.filter((e) => e.index !== index));
  };

  return (
    <Box display={isEditing ? "flex" : ""}>
      <Box className={classes.rowContainer}>
        <Typography variant="h4" className={classes.roleLabel}>
          {role === StudentRole.CHILD ? "Children" : "Additional members"}
        </Typography>
      </Box>
      <Box alignSelf="center" width="100%">
        {students.map((student, i) => (
          <Box
            key={student.index}
            display="flex"
            marginBottom={isEditing ? 1 : 0}
          >
            {isEditing && (
              <Box className={classes.rowContainer} minWidth={32}>
                {(role === StudentRole.GUEST || students.length > 1) && (
                  <IconButton
                    aria-label={`delete ${role}`}
                    onClick={() => onDeleteStudent(student.index)}
                    className={classes.deleteButton}
                  >
                    <RemoveCircle className={classes.deleteButton} />
                  </IconButton>
                )}
              </Box>
            )}
            <Box
              flex="auto"
              width={isEditing && dense ? DENSE_FIELD_WIDTH : null}
            >
              <Field
                field={{ ...DefaultFields.FIRST_NAME, role }}
                index={i}
                onChange={(value) =>
                  onUpdateStudent(i, { ...student, first_name: value })
                }
                value={student.first_name}
                {...fieldProps}
              />
              <Field
                field={{ ...DefaultFields.LAST_NAME, role }}
                index={i}
                onChange={(value) =>
                  onUpdateStudent(i, { ...student, last_name: value })
                }
                value={student.last_name}
                {...fieldProps}
              />
              <Field
                field={{ ...DefaultFields.DATE_OF_BIRTH, role }}
                index={i}
                onChange={(value) => {
                  const dob = value || null;
                  onUpdateStudent(i, {
                    ...student,
                    date_of_birth: dob,
                  });
                }}
                value={student.date_of_birth || ""}
                {...fieldProps}
              />
              <StudentDynamicFields
                dense={dense}
                dynamicFields={dynamicFields}
                index={i}
                information={student.information}
                isEditing={isEditing}
                onChange={(value) =>
                  onUpdateStudent(i, {
                    ...student,
                    information: value,
                  })
                }
                variant={fieldProps.variant}
              />
              {!isEditing && i < students.length - 1 && (
                <Box paddingY={2}>
                  <Divider />
                </Box>
              )}
            </Box>
          </Box>
        ))}
        {isEditing && (
          <Button
            onClick={onAddStudent}
            className={classes.addButton}
            size={dense ? "small" : "medium"}
            variant="outlined"
          >
            <Add fontSize="small" className={classes.addButtonIcon} />
            Add {role === StudentRole.CHILD ? "child" : "member"}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default StudentForm;
