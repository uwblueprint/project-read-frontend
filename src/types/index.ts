import DefaultFieldKey from "constants/DefaultFieldKey";
import EnrolmentStatus from "constants/EnrolmentStatus";
import StudentRole from "constants/StudentRole";

export type User = {
  id: number;
  first_name: string;
  last_name: string;
};

type Field = {
  is_default: boolean;
  name: string;
  options: string[];
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
  [DefaultFieldKey.DATE_OF_BIRTH]: string | null;
  [DefaultFieldKey.FIRST_NAME]: string;
  [DefaultFieldKey.LAST_NAME]: string;
  id: number;
  information: Record<number, string>; // dynamic fields
  role: StudentRole;
};

export type Family = {
  [DefaultFieldKey.ADDRESS]: string;
  [DefaultFieldKey.CELL_NUMBER]: string;
  [DefaultFieldKey.EMAIL]: string;
  [DefaultFieldKey.HOME_NUMBER]: string;
  [DefaultFieldKey.ID]: number;
  [DefaultFieldKey.NOTES]: string;
  [DefaultFieldKey.NUM_CHILDREN]: number;
  [DefaultFieldKey.CHILDREN]: Student[];
  [DefaultFieldKey.PHONE_NUMBER]: string;
  [DefaultFieldKey.PREFERRED_CONTACT]: string;
  [DefaultFieldKey.PREFERRED_NUMBER]: string;
  [DefaultFieldKey.WORK_NUMBER]: string;
  parent: Student;
};

export type Session = {
  fields: number[]; // array of field IDs
  id: number;
  name: string;
  start_date: string;
};

export type Attendance = {
  date: string;
  attendees: number[];
};

export type Interaction = {
  date: string;
  type: string;
};

export type Class = {
  id: number;
  attendance: Attendance[];
  colour: string;
  name: string;
};

export type Enrolment = {
  id: number;
  status: EnrolmentStatus;
  students: number[];
};
