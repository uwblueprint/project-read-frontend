import * as APIUtils from "./APIUtils";
import {
  FamilyListResponse,
  FamilyDetailResponse,
  FamilySearchResponse,
  FamilyRequest,
  StudentListRequest,
  StudentListResponse,
} from "./types";

const getFamilies = (): Promise<FamilyListResponse[]> =>
  APIUtils.get("/families/") as Promise<FamilyListResponse[]>;

const getFamiliesByParentName = (
  firstName: string,
  lastName: string
): Promise<FamilySearchResponse[]> =>
  APIUtils.get(
    `/families/search/?parent_only=True&first_name=${firstName}&last_name=${lastName}`
  ) as Promise<FamilySearchResponse[]>;

const getFamiliesByStudentName = (
  firstName: string,
  lastName: string
): Promise<FamilySearchResponse[]> =>
  APIUtils.get(
    `/families/search/?first_name=${firstName}&last_name=${lastName}`
  ) as Promise<FamilySearchResponse[]>;

const getFamilyById = (id: number): Promise<FamilyDetailResponse> =>
  APIUtils.get(`/families/${id}`) as Promise<FamilyDetailResponse>;

const postFamily = (data: FamilyRequest): Promise<FamilyDetailResponse> =>
  APIUtils.post("/families/", data) as Promise<FamilyDetailResponse>;

const putFamily = (
  data: FamilyRequest & { id: number }
): Promise<FamilyDetailResponse> =>
  APIUtils.put(`/families/${data.id}/`, data) as Promise<FamilyDetailResponse>;

const exportFamilies = (): Promise<string> =>
  APIUtils.get(`/export/families`, true) as Promise<string>;

const postStudent = (data: StudentListRequest): Promise<StudentListResponse> =>
  APIUtils.post("/students/", data) as Promise<StudentListResponse>;

export default {
  exportFamilies,
  getFamilies,
  getFamiliesByParentName,
  getFamiliesByStudentName,
  getFamilyById,
  postFamily,
  putFamily,
  postStudent,
};
