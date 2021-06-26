import React from "react";

import { Button, Typography } from "@material-ui/core";

import { FamilyDetailResponse, FamilyRequest, StudentRequest } from "api/types";
import DefaultFieldKey from "constants/DefaultFieldKey";
import StudentRole from "constants/StudentRole";
import { DynamicField } from "types";

import FamilyParentFields from "./family-parent-fields";
import StudentForm, { StudentFormData } from "./student-form";

// unique identifier for children form components
let CHILD_KEY_COUNTER = 1;
let GUEST_KEY_COUNTER = 1;

export enum TestId {
  RegistrationForm = "registration-form",
  SessionLabel = "session-label",
}

export type FamilyStudentFormData = FamilyRequest & {
  children: StudentFormData[];
  guests: StudentFormData[];
  parent: StudentRequest;
};

const defaultStudentData: StudentRequest = {
  [DefaultFieldKey.FIRST_NAME]: "",
  [DefaultFieldKey.LAST_NAME]: "",
  information: {},
};

const generateKey = (role: StudentRole.CHILD | StudentRole.GUEST): number => {
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

const studentRequestToStudentFormData = (
  student: StudentRequest,
  role: StudentRole.CHILD | StudentRole.GUEST
): StudentFormData => ({ ...student, index: generateKey(role) });

export const familyResponseToFamilyFormData = (
  family: FamilyDetailResponse
): FamilyStudentFormData => ({
  ...family,
  children: family.children.map((child) =>
    studentRequestToStudentFormData(child, StudentRole.CHILD)
  ),
  guests: family.guests.map((guest) =>
    studentRequestToStudentFormData(guest, StudentRole.GUEST)
  ),
});

export const studentFormDataToStudentRequest = (
  obj: StudentFormData
): StudentRequest => {
  const { index, ...req } = obj;
  return req as StudentRequest;
};

type Props = {
  family: FamilyStudentFormData;
  childDynamicFields: DynamicField[];
  guestDynamicFields: DynamicField[];
  parentDynamicFields: DynamicField[];
  onChange: (family: FamilyStudentFormData) => void;
};

const FamilyForm = ({
  family,
  childDynamicFields,
  guestDynamicFields,
  parentDynamicFields,
  onChange,
}: Props) => {
  const handleAddStudent = (
    role: StudentRole.GUEST | StudentRole.CHILD
  ): void => {
    if (role === StudentRole.CHILD) {
      onChange({
        ...family,
        children: [
          ...family.children,
          { ...defaultStudentData, index: generateKey(role) },
        ],
      });
    } else {
      onChange({
        ...family,
        guests: [
          ...family.guests,
          { ...defaultStudentData, index: generateKey(role) },
        ],
      });
    }
  };

  const updateStudent = (
    index: number,
    data: StudentRequest,
    role: StudentRole.GUEST | StudentRole.CHILD
  ): void => {
    const students =
      role === StudentRole.CHILD ? [...family.children] : [...family.guests];
    students[index] = { ...students[index], ...data };
    if (role === StudentRole.CHILD) {
      onChange({ ...family, children: students });
    } else {
      onChange({ ...family, guests: students });
    }
  };

  const handleDeleteStudent = (
    index: number,
    role: StudentRole.CHILD | StudentRole.GUEST
  ): void => {
    const data = role === StudentRole.CHILD ? family.children : family.guests;
    const students = data.filter((e) => e.index !== index);
    if (role === StudentRole.CHILD) {
      onChange({ ...family, children: [...students] });
    } else {
      onChange({ ...family, guests: [...students] });
    }
  };

  return (
    <>
      <Typography component="h3" variant="h5" style={{ marginBottom: 16 }}>
        Basic information
      </Typography>
      <FamilyParentFields
        dynamicFields={parentDynamicFields}
        family={family}
        onChange={(value) => onChange({ ...family, ...value })}
      />

      <Typography component="h3" variant="h5">
        Children
      </Typography>
      <StudentForm
        dynamicFields={childDynamicFields}
        studentData={family.children}
        updateStudent={updateStudent}
        handleDeleteStudent={handleDeleteStudent}
        role={StudentRole.CHILD}
      />
      <Button onClick={() => handleAddStudent(StudentRole.CHILD)}>
        Add Child
      </Button>

      <Typography component="h3" variant="h5">
        Family members
      </Typography>
      <StudentForm
        dynamicFields={guestDynamicFields}
        studentData={family.guests}
        updateStudent={updateStudent}
        handleDeleteStudent={handleDeleteStudent}
        role={StudentRole.GUEST}
      />
      <Button onClick={() => handleAddStudent(StudentRole.GUEST)}>
        Add Family Member
      </Button>
    </>
  );
};

export default FamilyForm;
