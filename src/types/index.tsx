/* eslint-disable camelcase */
import { DefaultFieldName } from "../constants/DefaultFields";

export type Field = {
  id: number;
  role: string;
  name: string;
  question_type: string;
  is_default: boolean;
};

export type Student = {
  id: number;
  role: "Parent" | "Child" | "Guest";
  [DefaultFieldName.FIRST_NAME]: string;
  [DefaultFieldName.LAST_NAME]: string;
  information: {
    [key: number]: string | number; // dynamic fields
  };
};

export type Family = {
  [DefaultFieldName.ID]: number;
  [DefaultFieldName.EMAIL]: string;
  [DefaultFieldName.PHONE_NUMBER]: string;
  [DefaultFieldName.PREFERRED_CONTACT]: string;
  [DefaultFieldName.NUM_CHILDREN]: number;
  parent: Student;
};
