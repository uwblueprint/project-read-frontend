import React from "react";

import { Box, Button, IconButton, Typography } from "@material-ui/core";
import { Add, RemoveCircle } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

import { StudentRequest } from "api/types";
import StudentRole from "constants/StudentRole";
import { DynamicField } from "types";

import StudentFields from "../student-fields";

const useStyles = makeStyles(() => ({
  addButton: {
    marginLeft: 32,
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

export type StudentFormData = StudentRequest & { index: number };

type Props = {
  dynamicFields: DynamicField[];
  onAddStudent: () => void;
  onDeleteStudent: (id: number) => void;
  onUpdateStudent: (id: number, data: StudentRequest) => void;
  role: StudentRole.CHILD | StudentRole.GUEST;
  students: StudentFormData[];
};

const StudentForm = ({
  dynamicFields,
  onAddStudent,
  onDeleteStudent,
  onUpdateStudent,
  role,
  students,
}: Props) => {
  const classes = useStyles();
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
              <StudentFields
                dynamicFields={dynamicFields}
                onChange={(data) => onUpdateStudent(i, data)}
                role={role}
                student={student}
              />
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
