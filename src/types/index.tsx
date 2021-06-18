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
  information: Record<number, string>; // dynamic fields
  role: StudentRole;
  date_of_birth: string;
};

export type Family = {
  [DefaultFieldKey.ADDRESS]: string;
  [DefaultFieldKey.CELL_NUMBER]: string;
  [DefaultFieldKey.CURRENT_CLASS]: string;
  [DefaultFieldKey.EMAIL]: string;
  [DefaultFieldKey.ENROLLED]: string;
  [DefaultFieldKey.HOME_NUMBER]: string;
  [DefaultFieldKey.ID]: number;
  [DefaultFieldKey.NUM_CHILDREN]: number;
  [DefaultFieldKey.CHILDREN]: Student[];
  [DefaultFieldKey.PHONE_NUMBER]: string;
  [DefaultFieldKey.PREFERRED_CONTACT]: string;
  [DefaultFieldKey.PREFERRED_NUMBER]: string;
  [DefaultFieldKey.STATUS]: string;
  [DefaultFieldKey.WORK_NUMBER]: string;
  parent: Student;
};

export type Session = {
  fields: number[]; // array of field IDs
  id: number;
  season: string;
  start_date: string;
  year: number;
};

export type Attendance = {
  date: string;
  attendees: number[];
};

export type ClassInfo = {
  id: number;
  name: string;
  session_id: number;
  facilitator_id: number;
  attendance: Attendance[];
  families: Family[];
};
