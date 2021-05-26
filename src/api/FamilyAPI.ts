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
  | "children"
  | "guests"
  | "parent"
>;

export type FamilyListResponse = Pick<
  Family,
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

type StudentRequest = Pick<
  Student,
  DefaultFieldKey.FIRST_NAME | DefaultFieldKey.LAST_NAME | "information"
>;

export type FamilyRequest = Pick<
  Family,
  | DefaultFieldKey.ADDRESS
  | DefaultFieldKey.CELL_NUMBER
  | DefaultFieldKey.EMAIL
  | DefaultFieldKey.HOME_NUMBER
  | DefaultFieldKey.PREFERRED_CONTACT
  | DefaultFieldKey.PREFERRED_NUMBER
  | DefaultFieldKey.WORK_NUMBER
> & {
  children: StudentRequest[];
  guests: StudentRequest[];
  parent: StudentRequest;
};

const getFamilies = (): Promise<FamilyListResponse[]> =>
  APIUtils.get("/families/");

const getFamilyById = (id: number): Promise<FamilyDetailResponse> =>
  APIUtils.get(`/families/${id}`);

const postFamily = (data: FamilyRequest) => APIUtils.post("/families/", data);

export default { getFamilies, getFamilyById, postFamily };
