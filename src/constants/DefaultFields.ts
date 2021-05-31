import { DefaultField } from "../types";
import DefaultFieldKey from "./DefaultFieldKey";
import QuestionTypes from "./QuestionTypes";

export const DefaultFields: Record<string, DefaultField> = Object.freeze({
  ADDRESS: {
    id: DefaultFieldKey.ADDRESS,
    is_default: false,
    name: "Address",
    question_type: QuestionTypes.TEXT,
  },
  CELL_NUMBER: {
    id: DefaultFieldKey.CELL_NUMBER,
    is_default: false,
    name: "Cell phone",
    question_type: QuestionTypes.TEXT,
  },
  CURRENT_CLASS: {
    id: DefaultFieldKey.CURRENT_CLASS,
    is_default: true,
    name: "Current Class",
    question_type: QuestionTypes.MULTIPLE_CHOICE,
  },
  EMAIL: {
    id: DefaultFieldKey.EMAIL,
    is_default: true,
    name: "Email",
    question_type: QuestionTypes.TEXT,
  },
  ENROLLED: {
    id: DefaultFieldKey.ENROLLED,
    is_default: true,
    name: "Enrolled",
    question_type: QuestionTypes.MULTIPLE_CHOICE,
  },
  FIRST_NAME: {
    id: DefaultFieldKey.FIRST_NAME,
    is_default: true,
    name: "First name",
    question_type: QuestionTypes.TEXT,
  },
  HOME_NUMBER: {
    id: DefaultFieldKey.HOME_NUMBER,
    is_default: false,
    name: "Home phone",
    question_type: QuestionTypes.TEXT,
  },
  ID: {
    id: DefaultFieldKey.ID,
    is_default: false,
    name: "Id",
    question_type: QuestionTypes.TEXT,
  },
  LAST_NAME: {
    id: DefaultFieldKey.LAST_NAME,
    is_default: true,
    name: "Last name",
    question_type: QuestionTypes.TEXT,
  },
  NUM_CHILDREN: {
    id: DefaultFieldKey.NUM_CHILDREN,
    is_default: true,
    name: "No. of children",
    question_type: QuestionTypes.TEXT,
  },
  CHILDREN: {
    id: DefaultFieldKey.CHILDREN,
    is_default: true,
    name: "Children",
    question_type: QuestionTypes.TEXT,
  },
  PHONE_NUMBER: {
    id: DefaultFieldKey.PHONE_NUMBER,
    is_default: true,
    name: "Phone number",
    question_type: QuestionTypes.TEXT,
  },
  PREFERRED_CONTACT: {
    id: DefaultFieldKey.PREFERRED_CONTACT,
    is_default: true,
    name: "Preferred contact",
    question_type: QuestionTypes.MULTIPLE_CHOICE,
  },
  PREFERRED_NUMBER: {
    id: DefaultFieldKey.PREFERRED_NUMBER,
    is_default: false,
    name: "Preferred number",
    question_type: QuestionTypes.MULTIPLE_CHOICE,
  },
  STATUS: {
    id: DefaultFieldKey.STATUS,
    is_default: true,
    name: "Status",
    question_type: QuestionTypes.MULTIPLE_CHOICE,
  },
  WORK_NUMBER: {
    id: DefaultFieldKey.WORK_NUMBER,
    is_default: false,
    name: "Work phone",
    question_type: QuestionTypes.TEXT,
  },
});

export const DefaultFamilyTableFields: DefaultField[] = [
  // default view
  DefaultFields.FIRST_NAME,
  DefaultFields.LAST_NAME,
  DefaultFields.PHONE_NUMBER,
  DefaultFields.EMAIL,
  DefaultFields.NUM_CHILDREN,
  DefaultFields.CHILDREN,
  DefaultFields.PREFERRED_CONTACT,
  // can expand to view
  DefaultFields.CELL_NUMBER,
  DefaultFields.HOME_NUMBER,
  DefaultFields.PREFERRED_NUMBER,
];

export const DefaultFamilyTableEnrolmentFields: DefaultField[] = [
  DefaultFields.ENROLLED,
  DefaultFields.CURRENT_CLASS,
  DefaultFields.STATUS,
];

export const DefaultFamilyFormFields: DefaultField[] = [
  DefaultFields.HOME_NUMBER,
  DefaultFields.CELL_NUMBER,
  DefaultFields.WORK_NUMBER,
  DefaultFields.PREFERRED_NUMBER,
  DefaultFields.EMAIL,
  DefaultFields.PREFERRED_CONTACT,
];

export const DefaultStudentFormFields: DefaultField[] = [
  DefaultFields.FIRST_NAME,
  DefaultFields.LAST_NAME,
];
