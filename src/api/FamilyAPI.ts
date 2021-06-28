import DefaultFieldKey from "../constants/DefaultFieldKey";
import { Family, Student } from "../types";
import * as APIUtils from "./APIUtils";

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
};

export type FamilyListResponse = Pick<
  Family,
  | DefaultFieldKey.CHILDREN
  | DefaultFieldKey.CURRENT_CLASS
  | DefaultFieldKey.EMAIL
  | DefaultFieldKey.ENROLLED
  | DefaultFieldKey.ID
  | DefaultFieldKey.NUM_CHILDREN
  | DefaultFieldKey.PHONE_NUMBER
  | DefaultFieldKey.PREFERRED_CONTACT
  | DefaultFieldKey.STATUS
  | "parent"
>;

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

export type FamilyRequest = Pick<
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
  DefaultFieldKey.FIRST_NAME | DefaultFieldKey.LAST_NAME | "information"
>;

export type FamilyStudentRequest = FamilyRequest & {
  children: StudentRequest[];
  guests: StudentRequest[];
  parent: StudentRequest;
};

const getFamilies = (): Promise<FamilyListResponse[]> =>
  APIUtils.get("/families/");

const getFamiliesByParentName = (
  firstName: string,
  lastName: string
): Promise<FamilySearchResponse[]> =>
  APIUtils.get(
    `/families/search/?first_name=${firstName}&last_name=${lastName}`
  );

const getFamilyById = (id: number): Promise<FamilyDetailResponse> =>
  APIUtils.get(`/families/${id}`);

const postFamily = (data: FamilyStudentRequest) =>
  APIUtils.post("/families/", data);

export default {
  getFamilies,
  getFamiliesByParentName,
  getFamilyById,
  postFamily,
};
