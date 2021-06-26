import React from "react";

import { Button, Typography } from "@material-ui/core";

import { StudentRequest } from "api/types";
import StudentFields from "components/common/student-fields";
import StudentRole from "constants/StudentRole";
import { DynamicField } from "types";

export enum TestId {
  ChildrenDefaultFields = "children-default-fields",
  ChildrenDynamicFields = "children-dynamic-fields",
  GuestsDefaultFields = "guests-default-fields",
  GuestsDynamicFields = "guests-dynamic-fields",
}

export type StudentFormData = StudentRequest & { index: number };

type StudentRegistrationFormProps = {
  dynamicFields: DynamicField[];
  studentData: StudentFormData[];
  updateStudent: (
    id: number,
    data: StudentRequest,
    role: StudentRole.CHILD | StudentRole.GUEST
  ) => void;
  handleDeleteStudent: (
    id: number,
    role: StudentRole.CHILD | StudentRole.GUEST
  ) => void;
  role: StudentRole.CHILD | StudentRole.GUEST;
};

const StudentRegistrationForm = ({
  dynamicFields,
  studentData,
  updateStudent,
  handleDeleteStudent,
  role,
}: StudentRegistrationFormProps) => {
  const roleName = role === StudentRole.CHILD ? "Child" : "Family Member";
  return (
    <>
      {studentData.map((student, i) => (
        <div key={student.index}>
          <Typography component="h4" variant="h6">
            {roleName} {i + 1}
          </Typography>
          {(role === StudentRole.GUEST || studentData.length > 1) && (
            <Button onClick={() => handleDeleteStudent(student.index, role)}>
              Delete {roleName}
            </Button>
          )}
          <StudentFields
            dynamicFields={dynamicFields}
            onChange={(data) => updateStudent(i, data, role)}
            role={role}
            student={student}
          />
        </div>
      ))}
    </>
  );
};

export default StudentRegistrationForm;
