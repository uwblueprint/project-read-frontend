import React from "react";

import { Button, Typography } from "@material-ui/core";

import { StudentRequest } from "api/types";
import StudentRole from "constants/StudentRole";
import { DynamicField } from "types";

import StudentFields from "../student-fields";

export enum TestId {
  ChildrenDefaultFields = "children-default-fields",
  ChildrenDynamicFields = "children-dynamic-fields",
  GuestsDefaultFields = "guests-default-fields",
  GuestsDynamicFields = "guests-dynamic-fields",
}

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
  const roleName = role === StudentRole.CHILD ? "Child" : "Family Member";
  return (
    <>
      {students.map((student, i) => (
        <div key={student.index}>
          <Typography component="h4" variant="h6">
            {roleName} {i + 1}
          </Typography>
          {(role === StudentRole.GUEST || students.length > 1) && (
            <Button onClick={() => onDeleteStudent(student.index)}>
              Delete {roleName}
            </Button>
          )}
          <StudentFields
            dynamicFields={dynamicFields}
            onChange={(data) => onUpdateStudent(i, data)}
            role={role}
            student={student}
          />
        </div>
      ))}
      <Button onClick={onAddStudent}>Add {roleName}</Button>
    </>
  );
};

export default StudentForm;
