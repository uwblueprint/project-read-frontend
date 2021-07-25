import * as APIUtils from "./APIUtils";
import {
  FamilyListResponse,
  FamilyDetailResponse,
  FamilyRequest,
  FamilySearchResponse,
} from "./types";

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

const postFamily = (data: FamilyRequest) => APIUtils.post("/families/", data);

export default {
  getFamilies,
  getFamiliesByParentName,
  getFamilyById,
  postFamily,
};
