import React from "react";

import { Box, Button, IconButton, Typography } from "@material-ui/core";
import { Add, RemoveCircle } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

import { StudentRequest } from "api/types";
import Field from "components/common/field";
import DefaultFieldKey from "constants/DefaultFieldKey";
import { DefaultFields } from "constants/DefaultFields";
import FieldVariant from "constants/FieldVariant";
import StudentRole from "constants/StudentRole";
import { DynamicField } from "types";

// unique identifier for children form components
let CHILD_KEY_COUNTER = 1;
let GUEST_KEY_COUNTER = 1;

const useStyles = makeStyles(() => ({
  addButton: {
    marginLeft: 32,
    marginTop: 10,
    paddingLeft: 12,
    paddingRight: 12,
  },
  addButtonIcon: {
    marginRight: 8,
  },
  deleteButton: {
    height: 16,
    width: 16,
  },
  deleteButtonIcon: {
    height: 16,
    width: 16,
  },
  roleLabel: {
    width: 128,
  },
  rowContainer: {
    alignItems: "center",
    display: "flex",
    height: 56,
  },
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

export type StudentFormData = StudentRequest & { index: number };

const defaultStudentData: StudentRequest = {
  [DefaultFieldKey.FIRST_NAME]: "",
  [DefaultFieldKey.LAST_NAME]: "",
  [DefaultFieldKey.DATE_OF_BIRTH]: null,
  information: {},
};

type Props = {
  dynamicFields: DynamicField[];
  onChange: (students: StudentFormData[]) => void;
  role: StudentRole.CHILD | StudentRole.GUEST;
  students: StudentFormData[];
};

const StudentForm = ({ dynamicFields, onChange, role, students }: Props) => {
  const classes = useStyles();

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
    <Box display="flex" paddingBottom={6}>
      <Box className={classes.rowContainer}>
        <Typography variant="h4" className={classes.roleLabel}>
          {role === StudentRole.CHILD ? "Children" : "Additional members"}
        </Typography>
      </Box>
      <div>
        {students.map((student, i) => (
          <Box key={student.index} display="flex">
            <Box className={classes.rowContainer} width={32}>
              {(role === StudentRole.GUEST || students.length > 1) && (
                <IconButton
                  aria-label={`delete ${role}`}
                  onClick={() => onDeleteStudent(student.index)}
                  className={classes.deleteButton}
                >
                  <RemoveCircle className={classes.deleteButtonIcon} />
                </IconButton>
              )}
            </Box>
            <div>
              <Field
                field={{ ...DefaultFields.FIRST_NAME, role }}
                onChange={(value) =>
                  onUpdateStudent(i, { ...student, first_name: value })
                }
                value={student.first_name}
                variant={FieldVariant.COMPACT}
              />
              <Field
                field={{ ...DefaultFields.LAST_NAME, role }}
                onChange={(value) =>
                  onUpdateStudent(i, { ...student, last_name: value })
                }
                value={student.last_name}
                variant={FieldVariant.COMPACT}
              />
              <Field
                field={{ ...DefaultFields.DATE_OF_BIRTH, role }}
                onChange={(value) => {
                  const dob = value || null;
                  onUpdateStudent(i, {
                    ...student,
                    date_of_birth: dob,
                  });
                }}
                value={student.date_of_birth || ""}
                variant={FieldVariant.COMPACT}
              />
              {dynamicFields.map((field) => (
                <Field
                  key={field.id}
                  field={field}
                  onChange={(value) =>
                    onUpdateStudent(i, {
                      ...student,
                      information: {
                        ...student.information,
                        [field.id]: value,
                      },
                    })
                  }
                  value={student.information[field.id] ?? ""}
                  variant={FieldVariant.COMPACT}
                />
              ))}
            </div>
          </Box>
        ))}
        <Button
          onClick={onAddStudent}
          className={classes.addButton}
          variant="outlined"
        >
          <Add fontSize="small" className={classes.addButtonIcon} />
          Add {role === StudentRole.CHILD ? "child" : "member"}
        </Button>
      </div>
    </Box>
  );
};

export default StudentForm;
