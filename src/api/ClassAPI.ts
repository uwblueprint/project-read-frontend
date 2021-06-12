import * as APIUtils from "./APIUtils";
import { ClassInfo } from "../types";

const getClass = (id: number): Promise<ClassInfo> =>
  APIUtils.get(`/classes/${id}`);

export default { getClass };
