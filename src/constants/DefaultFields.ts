import QuestionTypes from "./QuestionTypes";

export enum DefaultFieldName {
  ADDRESS = "address",
  CELL_NUMBER = "cell_number",
  EMAIL = "email",
  FIRST_NAME = "first_name",
  HOME_NUMBER = "home_number",
  ID = "id",
  LAST_NAME = "last_name",
  NUM_CHILDREN = "num_children",
  PHONE_NUMBER = "phone_number",
  PREFERRED_CONTACT = "preferred_comms",
  PREFERRED_NUMBER = "preferred_number",
  WORK_NUMBER = "work_number",
}

export const DefaultFields = Object.freeze({
  ADDRESS: {
    id: DefaultFieldName.ADDRESS,
    name: "Address",
    question_type: QuestionTypes.TEXT,
  },
  CELL_NUMBER: {
    id: DefaultFieldName.CELL_NUMBER,
    name: "Cell phone",
    question_type: QuestionTypes.TEXT,
  },
  EMAIL: {
    id: DefaultFieldName.EMAIL,
    name: "Email",
    question_type: QuestionTypes.TEXT,
  },
  FIRST_NAME: {
    id: DefaultFieldName.FIRST_NAME,
    name: "First name",
    question_type: QuestionTypes.TEXT,
  },
  HOME_NUMBER: {
    id: DefaultFieldName.HOME_NUMBER,
    name: "Home phone",
    question_type: QuestionTypes.TEXT,
  },
  ID: {
    id: DefaultFieldName.ID,
    name: "Id",
    question_type: QuestionTypes.TEXT,
  },
  LAST_NAME: {
    id: DefaultFieldName.LAST_NAME,
    name: "Last name",
    question_type: QuestionTypes.TEXT,
  },
  NUM_CHILDREN: {
    id: DefaultFieldName.NUM_CHILDREN,
    name: "No. of children",
    question_type: QuestionTypes.TEXT,
  },
  PHONE_NUMBER: {
    id: DefaultFieldName.PHONE_NUMBER,
    name: "Phone number",
    question_type: QuestionTypes.TEXT,
  },
  PREFERRED_CONTACT: {
    id: DefaultFieldName.PREFERRED_CONTACT,
    name: "Preferred contact",
    question_type: QuestionTypes.MULTIPLE_CHOICE,
  },
  PREFERRED_NUMBER: {
    id: DefaultFieldName.PREFERRED_NUMBER,
    name: "Preferred number",
    question_type: QuestionTypes.MULTIPLE_CHOICE,
  },
  WORK_NUMBER: {
    id: DefaultFieldName.WORK_NUMBER,
    name: "Work phone",
    question_type: QuestionTypes.TEXT,
  },
});

export const DefaultFamilyFields = [
  DefaultFields.CELL_NUMBER,
  DefaultFields.EMAIL,
  DefaultFields.HOME_NUMBER,
  DefaultFields.PREFERRED_NUMBER,
  DefaultFields.PREFERRED_CONTACT,
  DefaultFields.WORK_NUMBER,
];

export const DefaultStudentFields = [
  DefaultFields.FIRST_NAME,
  DefaultFields.LAST_NAME,
];
