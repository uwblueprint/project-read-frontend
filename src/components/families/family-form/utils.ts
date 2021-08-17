import { FamilyDetailResponse, FamilyRequest, StudentRequest } from "api/types";
import StudentRole from "constants/StudentRole";
import { Interaction } from "types";

import { generateKey } from "./student-form";
import { FamilyFormData, InteractionFormData, StudentFormData } from "./types";

let INTERACTIONS_COUNTER = 1;

const studentRequestToStudentFormData = (
  student: StudentRequest,
  role: StudentRole.CHILD | StudentRole.GUEST
): StudentFormData => ({ ...student, index: generateKey(role) });

export const generateInteractionsKey = (): number => {
  const key = INTERACTIONS_COUNTER;
  INTERACTIONS_COUNTER += 1;
  return key;
};

const interactionToInteractionFormData = (
  interaction: Interaction
): InteractionFormData => ({
  ...interaction,
  index: generateInteractionsKey(),
  isEditing: false,
});

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
  interactions: family.interactions.map((interaction) =>
    interactionToInteractionFormData(interaction)
  ),
});

const studentFormDataToStudentRequest = (
  obj: StudentFormData
): StudentRequest => {
  const { index, ...req } = obj;
  return req as StudentRequest;
};

export const familyFormDataToFamilyRequest = (
  family: FamilyFormData
): FamilyRequest => ({
  ...family,
  children: family.children.map((child) =>
    studentFormDataToStudentRequest(child)
  ),
  guests: family.guests.map((guest) => studentFormDataToStudentRequest(guest)),
  interactions: family.interactions.map(
    ({ index, isEditing, ...interaction }) => interaction
  ),
});
