import { FamilyDetailResponse, FamilyRequest, StudentRequest } from "api/types";
import StudentRole from "constants/StudentRole";

import { generateKey, StudentFormData } from "./student-form";

export type FamilyFormData = FamilyRequest & {
  children: StudentFormData[];
  guests: StudentFormData[];
  parent: StudentRequest;
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
