import * as APIUtils from "./APIUtils";
import {
  FamilyListResponse,
  FamilyDetailResponse,
  FamilySearchResponse,
  FamilyRequest,
} from "./types";

const getFamilies = (): Promise<FamilyListResponse[]> =>
  APIUtils.get("/families/") as Promise<FamilyListResponse[]>;

const getFamiliesByParentName = (
  firstName: string,
  lastName: string
): Promise<FamilySearchResponse[]> =>
  APIUtils.get(
    `/families/search/?first_name=${firstName}&last_name=${lastName}`
  ) as Promise<FamilySearchResponse[]>;

const getFamilyById = (id: number): Promise<FamilyDetailResponse> =>
  APIUtils.get(`/families/${id}`) as Promise<FamilyDetailResponse>;

const postFamily = (data: FamilyRequest): Promise<FamilyDetailResponse> =>
  APIUtils.post(`/families/`, data) as Promise<FamilyDetailResponse>;

const putFamily = (
  data: FamilyRequest & { id: number }
): Promise<FamilyDetailResponse> =>
  APIUtils.put(`/families/${data.id}/`, data) as Promise<FamilyDetailResponse>;

const exportFamilies = (): Promise<string> =>
  APIUtils.get(`/export/families`, true) as Promise<string>;

export default {
  getFamilies,
  getFamiliesByParentName,
  getFamilyById,
  postFamily,
  putFamily,
  exportFamilies,
};
