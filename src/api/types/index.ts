import DefaultFieldKey from "constants/DefaultFieldKey";
import {
  Class,
  DaysOfWeek,
  DynamicField,
  Enrolment,
  Family,
  Interaction,
  Session,
  Student,
  User,
} from "types";

export type UserResponse = Pick<User, "id" | "first_name" | "last_name">;

export type ClassListResponse = Pick<Class, "id" | "name" | "colour">;

export type ClassDetailResponse = Class & {
  families: FamilyListResponse[];
};

export type SessionListResponse = Pick<Session, "id" | "name"> & {
  classes: ClassListResponse[];
};
export type ClassRequest = ClassDetailResponse;

export type SessionDetailResponse = Session & {
  classes: ClassListResponse[];
  families: FamilyListResponse[];
};

export type EnrolmentResponse = Enrolment & {
  session: SessionListResponse;
  preferred_class: ClassListResponse | null;
  enrolled_class: ClassListResponse | null;
};

export type EnrolmentRequest = Enrolment & {
  session: number;
  preferred_class: number | null;
  enrolled_class: number | null;
};

export type FamilyDetailResponse = Pick<
  Family,
  | DefaultFieldKey.ADDRESS
  | DefaultFieldKey.CELL_NUMBER
  | DefaultFieldKey.EMAIL
  | DefaultFieldKey.HOME_NUMBER
  | DefaultFieldKey.ID
  | DefaultFieldKey.NOTES
  | DefaultFieldKey.PREFERRED_CONTACT
  | DefaultFieldKey.PREFERRED_NUMBER
  | DefaultFieldKey.WORK_NUMBER
  | "parent"
  | "interactions"
> & {
  children: Student[];
  current_enrolment: EnrolmentResponse | null;
  guests: Student[];
};

export type FamilyListResponse = Pick<
  Family,
  | DefaultFieldKey.CHILDREN
  | DefaultFieldKey.GUESTS
  | DefaultFieldKey.EMAIL
  | DefaultFieldKey.ID
  | DefaultFieldKey.NUM_CHILDREN
  | DefaultFieldKey.PHONE_NUMBER
  | DefaultFieldKey.PREFERRED_CONTACT
  | "parent"
> & {
  enrolment: EnrolmentResponse | null;
};

export type FamilySearchResponse = Pick<
  Family,
  | DefaultFieldKey.EMAIL
  | DefaultFieldKey.ID
  | DefaultFieldKey.NUM_CHILDREN
  | DefaultFieldKey.PHONE_NUMBER
> & {
  [DefaultFieldKey.FIRST_NAME]: string;
  [DefaultFieldKey.LAST_NAME]: string;
};

export type FamilyBaseRequest = Pick<
  Family,
  | DefaultFieldKey.ADDRESS
  | DefaultFieldKey.CELL_NUMBER
  | DefaultFieldKey.EMAIL
  | DefaultFieldKey.HOME_NUMBER
  | DefaultFieldKey.NOTES
  | DefaultFieldKey.PREFERRED_CONTACT
  | DefaultFieldKey.PREFERRED_NUMBER
  | DefaultFieldKey.WORK_NUMBER
>;

export type ClassRequest = {
  name: string;
  days: DaysOfWeek[];
  location: string;
  facilitator: number | null;
};

export type SessionRequest = {
  name: string;
  startDate: Date | null;
  classes: ClassRequest[];
};

export type StudentRequest = Pick<
  Student,
  | DefaultFieldKey.DATE_OF_BIRTH
  | DefaultFieldKey.FIRST_NAME
  | DefaultFieldKey.LAST_NAME
  | "information"
>;

export type FamilyRequest = FamilyBaseRequest & {
  children: StudentRequest[];
  guests: StudentRequest[];
  parent: StudentRequest;
  interactions: Interaction[];
};

export type DynamicFieldsResponse = {
  parent_fields: DynamicField[];
  child_fields: DynamicField[];
  guest_fields: DynamicField[];
  session_fields: DynamicField[];
};
