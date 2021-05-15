import { DefaultFieldName } from "../constants/DefaultFields";

export type Field = {
  id: number;
  is_default: boolean;
  name: string;
  question_type: string;
  role: string;
};

export type Student = {
  [DefaultFieldName.FIRST_NAME]: string;
  [DefaultFieldName.LAST_NAME]: string;
  id: number;
  information: {
    [key: number]: string | number; // dynamic fields
  };
  role: "Parent" | "Child" | "Guest";
};

export type Family = {
  [DefaultFieldName.EMAIL]: string;
  [DefaultFieldName.ID]: number;
  [DefaultFieldName.NUM_CHILDREN]: number;
  [DefaultFieldName.PHONE_NUMBER]: string;
  [DefaultFieldName.PREFERRED_CONTACT]: string;
  parent: Student;
};
