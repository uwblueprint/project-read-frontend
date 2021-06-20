import * as APIUtils from "./APIUtils";
import { FamilyListResponse } from "./FamilyAPI";
import { Attendance } from "../types/index";

export type Class = {
  id: number;
  name: string;
  session_id: number;
  facilitator_id: number;
  attendance: Attendance[];
  families: FamilyListResponse[];
};

const getClass = (id: number): Promise<Class> => APIUtils.get(`/classes/${id}`);

export default { getClass };
