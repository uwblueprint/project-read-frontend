import DefaultFieldKey from "constants/DefaultFieldKey";
import EnrolmentStatus from "constants/EnrolmentStatus";
import StudentRole from "constants/StudentRole";

export enum DaysOfWeek {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

export type User = {
  id: number;
  date_joined: Date;
  email: string;
  first_name: string;
  is_active: boolean;
  is_admin: boolean;
  last_name: string;
};

export enum FieldType {
  Default = "default",
  Dynamic = "dynamic",
}

type Field = {
  is_default: boolean;
  name: string;
  options: string[];
  question_type: string;
};

export type DefaultField = Field & {
  id: DefaultFieldKey;
  type: FieldType.Default;
};

export type DynamicField = Field & {
  id: number;
  order: number;
  role: StudentRole;
  type: FieldType.Dynamic;
};

export type Student = {
  [DefaultFieldKey.DATE_OF_BIRTH]: string | null;
  [DefaultFieldKey.FIRST_NAME]: string;
  [DefaultFieldKey.LAST_NAME]: string;
  id: number;
  information: Record<number, string>; // dynamic fields
  role: StudentRole;
};

export type Interaction = {
  date: string;
  type: string;
  user_id: number;
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
  [DefaultFieldKey.GUESTS]: Student[];
  [DefaultFieldKey.PHONE_NUMBER]: string;
  [DefaultFieldKey.PREFERRED_CONTACT]: string;
  [DefaultFieldKey.PREFERRED_NUMBER]: string;
  [DefaultFieldKey.WORK_NUMBER]: string;
  parent: Student;
  interactions: Interaction[];
};

export type Session = {
  active: boolean;
  fields: number[]; // array of field IDs
  id: number;
  name: string;
  start_date: Date | null;
};

export type Attendance = {
  date: string;
  attendees: number[];
};

export type Class = {
  id: number;
  attendance: Attendance[];
  colour: string;
  name: string;
};

export type Enrolment = {
  id: number;
  created_at: Date;
  family: number; // family id
  is_guest: boolean;
  status: EnrolmentStatus;
  students: number[];
};
