import React from "react";

import { Typography } from "@material-ui/core";

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

export type FamilyFormData = FamilyRequest & {
  children: StudentFormData[];
  guests: StudentFormData[];
  parent: StudentRequest;
};

const defaultStudentData: StudentRequest = {
  [DefaultFieldKey.FIRST_NAME]: "",
  [DefaultFieldKey.LAST_NAME]: "",
  [DefaultFieldKey.DATE_OF_BIRTH]: null,
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
): FamilyFormData => ({
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
  family: FamilyFormData;
  childDynamicFields: DynamicField[];
  guestDynamicFields: DynamicField[];
  parentDynamicFields: DynamicField[];
  onChange: (family: FamilyFormData) => void;
};

const FamilyForm = ({
  family,
  childDynamicFields,
  guestDynamicFields,
  parentDynamicFields,
  onChange,
}: Props) => {
  const addStudent = (role: StudentRole.GUEST | StudentRole.CHILD): void => {
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

  const deleteStudent = (
    index: number,
    role: StudentRole.CHILD | StudentRole.GUEST
  ): void => {
    const students = (role === StudentRole.CHILD
      ? [...family.children]
      : [...family.guests]
    ).filter((e) => e.index !== index);
    if (role === StudentRole.CHILD) {
      onChange({ ...family, children: students });
    } else {
      onChange({ ...family, guests: students });
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
        onAddStudent={() => addStudent(StudentRole.CHILD)}
        onDeleteStudent={(id) => deleteStudent(id, StudentRole.CHILD)}
        onUpdateStudent={(id, data) =>
          updateStudent(id, data, StudentRole.CHILD)
        }
        role={StudentRole.CHILD}
        students={family.children}
      />

      <Typography component="h3" variant="h5">
        Family members
      </Typography>
      <StudentForm
        dynamicFields={guestDynamicFields}
        onAddStudent={() => addStudent(StudentRole.GUEST)}
        onDeleteStudent={(id) => deleteStudent(id, StudentRole.GUEST)}
        onUpdateStudent={(id, data) =>
          updateStudent(id, data, StudentRole.GUEST)
        }
        role={StudentRole.GUEST}
        students={family.guests}
      />
    </>
  );
};

export default FamilyForm;
