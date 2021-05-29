import DefaultFieldKey from "../constants/DefaultFieldKey";
import StudentRole from "../constants/StudentRole";

type Field = {
  is_default: boolean;
  name: string;
  question_type: string;
};

export type DefaultField = Field & {
  id: DefaultFieldKey;
};

export type DynamicField = Field & {
  id: number;
  role: StudentRole;
};

export type Student = {
  [DefaultFieldKey.FIRST_NAME]: string;
  [DefaultFieldKey.LAST_NAME]: string;
  id: number;
  information: {
    [key: number]: string | number; // dynamic fields
  };
  role: StudentRole;
  date_of_birth: string;
};

export type Family = {
  [DefaultFieldKey.CURRENT_CLASS]: string;
  [DefaultFieldKey.EMAIL]: string;
  [DefaultFieldKey.ENROLLED]: string;
  [DefaultFieldKey.ID]: number;
  [DefaultFieldKey.NUM_CHILDREN]: number;
  [DefaultFieldKey.CHILDREN_INFO]: Student[];
  [DefaultFieldKey.PHONE_NUMBER]: string;
  [DefaultFieldKey.PREFERRED_CONTACT]: string;
  [DefaultFieldKey.STATUS]: string;
  parent: Student;
};

export type Session = {
  fields: number[]; // array of field IDs
  id: number;
  season: string;
  start_date: string;
  year: number;
};
