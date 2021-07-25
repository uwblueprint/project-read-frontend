import DefaultFieldKey from "constants/DefaultFieldKey";
import EnrolmentStatus from "constants/EnrolmentStatus";
import { Class, Session, Family, Student, DynamicField } from "types";

export type ClassListResponse = Pick<Class, "id" | "name">;

export type ClassDetailResponse = Class & {
  families: FamilyListResponse[];
};

export type SessionListResponse = Pick<Session, "id" | "season" | "year">;

export type SessionDetailResponse = Session & {
  classes: ClassListResponse[];
  families: FamilyListResponse[];
};

export type Enrolment = {
  id: number;
  session: SessionListResponse | null;
  preferred_class: ClassListResponse | null;
  enrolled_class: ClassListResponse | null;
  status: EnrolmentStatus;
};

export type FamilyDetailResponse = Pick<
  Family,
  | DefaultFieldKey.ADDRESS
  | DefaultFieldKey.CELL_NUMBER
  | DefaultFieldKey.EMAIL
  | DefaultFieldKey.HOME_NUMBER
  | DefaultFieldKey.ID
  | DefaultFieldKey.PREFERRED_CONTACT
  | DefaultFieldKey.PREFERRED_NUMBER
  | DefaultFieldKey.WORK_NUMBER
  | "parent"
> & {
  children: Student[];
  guests: Student[];
  current_enrolment: Enrolment | null;
};

export type FamilyListResponse = Pick<
  Family,
  | DefaultFieldKey.CHILDREN
  | DefaultFieldKey.EMAIL
  | DefaultFieldKey.ID
  | DefaultFieldKey.NUM_CHILDREN
  | DefaultFieldKey.PHONE_NUMBER
  | DefaultFieldKey.PREFERRED_CONTACT
  | "parent"
> & {
  current_enrolment: Enrolment | null;
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
  | DefaultFieldKey.PREFERRED_CONTACT
  | DefaultFieldKey.PREFERRED_NUMBER
  | DefaultFieldKey.WORK_NUMBER
>;

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
};

export type DynamicFieldsResponse = {
  parent_fields: DynamicField[];
  child_fields: DynamicField[];
  guest_fields: DynamicField[];
};
