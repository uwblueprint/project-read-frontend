import { Class } from "types/index";

import * as APIUtils from "./APIUtils";
import { ClassDetailResponse } from "./types";

const getClass = (id: number): Promise<ClassDetailResponse> =>
  APIUtils.get(`/classes/${id}`);

export default { getClass };
