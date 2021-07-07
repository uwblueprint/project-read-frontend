import { Class } from "types/index";

import * as APIUtils from "./APIUtils";
import { FamilyListResponse } from "./FamilyAPI";

export type ClassDetailResponse = Class & {
  families: FamilyListResponse[];
};

const getClass = (id: number): Promise<ClassDetailResponse> =>
  APIUtils.get(`/classes/${id}`);

export default { getClass };
