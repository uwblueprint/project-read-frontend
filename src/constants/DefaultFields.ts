import { DefaultField } from "types";

import DefaultFieldKey from "./DefaultFieldKey";
import QuestionType from "./QuestionType";

export const DefaultFields: Record<string, DefaultField> = Object.freeze({
  ADDRESS: {
    id: DefaultFieldKey.ADDRESS,
    is_default: false,
    name: "Address",
    question_type: QuestionType.TEXT,
    options: [],
  },
  CELL_NUMBER: {
    id: DefaultFieldKey.CELL_NUMBER,
    is_default: false,
    name: "Cell phone",
    question_type: QuestionType.TEXT,
    options: [],
  },
  CURRENT_CLASS: {
    id: DefaultFieldKey.CURRENT_CLASS,
    is_default: true,
    name: "Current Class",
    question_type: QuestionType.MULTIPLE_CHOICE,
    options: [],
  },
  CURRENT_SESSION: {
    id: DefaultFieldKey.CURRENT_SESSION,
    is_default: true,
    name: "Session",
    question_type: QuestionType.MULTIPLE_CHOICE,
    options: [],
  },
  CURRENT_PREFERRED_CLASS: {
    id: DefaultFieldKey.CURRENT_PREFERRED_CLASS,
    is_default: false,
    name: "Preferred Class",
    question_type: QuestionType.MULTIPLE_CHOICE,
    options: [],
  },
  DATE_OF_BIRTH: {
    id: DefaultFieldKey.DATE_OF_BIRTH,
    is_default: false,
    name: "Date of birth",
    question_type: QuestionType.DATE,
    options: [],
  },
  EMAIL: {
    id: DefaultFieldKey.EMAIL,
    is_default: true,
    name: "Email",
    question_type: QuestionType.TEXT,
    options: [],
  },
  IS_ENROLLED: {
    id: DefaultFieldKey.IS_ENROLLED,
    is_default: true,
    name: "Enrolled",
    question_type: QuestionType.MULTIPLE_CHOICE,
    options: [],
  },
  FIRST_NAME: {
    id: DefaultFieldKey.FIRST_NAME,
    is_default: true,
    name: "First name",
    question_type: QuestionType.TEXT,
    options: [],
  },
  HOME_NUMBER: {
    id: DefaultFieldKey.HOME_NUMBER,
    is_default: false,
    name: "Home phone",
    question_type: QuestionType.TEXT,
    options: [],
  },
  ID: {
    id: DefaultFieldKey.ID,
    is_default: false,
    name: "Id",
    question_type: QuestionType.TEXT,
    options: [],
  },
  LAST_NAME: {
    id: DefaultFieldKey.LAST_NAME,
    is_default: true,
    name: "Last name",
    question_type: QuestionType.TEXT,
    options: [],
  },
  NUM_CHILDREN: {
    id: DefaultFieldKey.NUM_CHILDREN,
    is_default: true,
    name: "No. of children",
    question_type: QuestionType.TEXT,
    options: [],
  },
  CHILDREN: {
    id: DefaultFieldKey.CHILDREN,
    is_default: true,
    name: "Children",
    question_type: QuestionType.TEXT,
    options: [],
  },
  PHONE_NUMBER: {
    id: DefaultFieldKey.PHONE_NUMBER,
    is_default: true,
    name: "Primary phone number",
    question_type: QuestionType.TEXT,
    options: [],
  },
  PREFERRED_CONTACT: {
    id: DefaultFieldKey.PREFERRED_CONTACT,
    is_default: true,
    name: "Preferred contact",
    question_type: QuestionType.MULTIPLE_CHOICE,
    options: ["Phone", "Email"],
  },
  PREFERRED_NUMBER: {
    id: DefaultFieldKey.PREFERRED_NUMBER,
    is_default: false,
    name: "Preferred number",
    question_type: QuestionType.MULTIPLE_CHOICE,
    options: ["Home", "Cell", "Work"],
  },
  STATUS: {
    id: DefaultFieldKey.STATUS,
    is_default: true,
    name: "Status",
    question_type: QuestionType.MULTIPLE_CHOICE,
    options: [],
  },
  WORK_NUMBER: {
    id: DefaultFieldKey.WORK_NUMBER,
    is_default: false,
    name: "Work phone",
    question_type: QuestionType.TEXT,
    options: [],
  },
});

export const DefaultFamilyTableFields: DefaultField[] = [
  DefaultFields.FIRST_NAME,
  DefaultFields.LAST_NAME,
  DefaultFields.PHONE_NUMBER,
  DefaultFields.EMAIL,
  DefaultFields.NUM_CHILDREN,
  DefaultFields.CHILDREN,
  DefaultFields.PREFERRED_CONTACT,
];

export const DefaultFamilyFormFields: DefaultField[] = [
  DefaultFields.HOME_NUMBER,
  DefaultFields.CELL_NUMBER,
  DefaultFields.WORK_NUMBER,
  DefaultFields.PREFERRED_NUMBER,
  DefaultFields.EMAIL,
  DefaultFields.PREFERRED_CONTACT,
];
