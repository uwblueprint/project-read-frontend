import * as APIUtils from "./APIUtils";
import { FamilyListResponse } from "./FamilyAPI";
import { Class } from "../types/index";

export type ClassDetailResponse = Class & {
  families: FamilyListResponse[];
};

const getClass = (id: number): Promise<ClassDetailResponse> =>
  APIUtils.get(`/classes/${id}`);

export default { getClass };
