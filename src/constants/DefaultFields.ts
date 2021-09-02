import { DefaultField } from "types";

import DefaultFieldKey from "./DefaultFieldKey";
import QuestionType from "./QuestionType";

const DefaultFields: Record<string, DefaultField> = Object.freeze({
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
  CHILDREN: {
    id: DefaultFieldKey.CHILDREN,
    is_default: true,
    name: "Children",
    question_type: QuestionType.TEXT,
    options: [],
  },
  ENROLLED_CLASS: {
    id: DefaultFieldKey.ENROLLED_CLASS,
    is_default: true,
    name: "Class",
    question_type: QuestionType.SELECT,
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
  PHONE_NUMBER: {
    id: DefaultFieldKey.PHONE_NUMBER,
    is_default: true,
    name: "Primary phone number",
    question_type: QuestionType.TEXT,
    options: [],
  },
  PREFERRED_CLASS: {
    id: DefaultFieldKey.PREFERRED_CLASS,
    is_default: false,
    name: "Preferred class",
    question_type: QuestionType.SELECT,
    options: [],
  },
  PREFERRED_CONTACT: {
    id: DefaultFieldKey.PREFERRED_CONTACT,
    is_default: true,
    name: "Preferred contact",
    question_type: QuestionType.TEXT,
    options: [],
  },
  PREFERRED_NUMBER: {
    id: DefaultFieldKey.PREFERRED_NUMBER,
    is_default: false,
    name: "Preferred number",
    question_type: QuestionType.SELECT,
    options: ["Home", "Cell", "Work"],
  },
  REGISTERED_AT: {
    id: DefaultFieldKey.REGISTERED_AT,
    is_default: true,
    name: "Registered at",
    question_type: QuestionType.DATE,
    options: [],
  },
  SESSION: {
    id: DefaultFieldKey.SESSION,
    is_default: true,
    name: "Current session",
    question_type: QuestionType.SELECT,
    options: [],
  },
  STATUS: {
    id: DefaultFieldKey.STATUS,
    is_default: true,
    name: "Status",
    question_type: QuestionType.SELECT,
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

export default DefaultFields;
