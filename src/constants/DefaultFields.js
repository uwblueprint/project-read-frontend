import QuestionTypes from "./QuestionTypes";

export const DefaultFields = Object.freeze({
  EMAIL: {
    id: "email",
    name: "Email",
    question_type: QuestionTypes.TEXT,
  },
  CELL_PHONE: {
    id: "cell_number",
    name: "Cell Phone",
    question_type: QuestionTypes.TEXT,
  },
  FIRST_NAME: {
    id: "first_name",
    name: "First name",
    question_type: QuestionTypes.TEXT,
  },
  HOME_PHONE: {
    id: "home_number",
    name: "Home Phone",
    question_type: QuestionTypes.TEXT,
  },
  ID: {
    id: "id",
    name: "Id",
    question_type: QuestionTypes.TEXT,
  },
  LAST_NAME: {
    id: "last_name",
    name: "Last name",
    question_type: QuestionTypes.TEXT,
  },
  NUM_CHILDREN: {
    id: "num_children",
    name: "No. of Children",
    question_type: QuestionTypes.TEXT,
  },
  PHONE: {
    id: "phone_number",
    name: "Phone Number",
    question_type: QuestionTypes.TEXT,
  },
  PREFERRED_CONTACT: {
    id: "preferred_comms",
    name: "Preferred Contact",
    question_type: QuestionTypes.MULTIPLE_CHOICE,
  },
  PREFERRED_NUMBER: {
    id: "preferred_number",
    name: "Preferred Number",
    question_type: QuestionTypes.MULTIPLE_CHOICE,
  },
  WORK_PHONE: {
    id: "work_number",
    name: "Work Phone",
    question_type: QuestionTypes.TEXT,
  },
});

export const DefaultFamilyFields = [
  DefaultFields.HOME_PHONE,
  DefaultFields.CELL_PHONE,
  DefaultFields.WORK_PHONE,
  DefaultFields.PREFERRED_NUMBER,
  DefaultFields.EMAIL,
  DefaultFields.PREFERRED_CONTACT,
];

export const DefaultStudentFields = [
  DefaultFields.FIRST_NAME,
  DefaultFields.LAST_NAME,
];
