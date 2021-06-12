import * as APIUtils from "./APIUtils";
import { Session } from "../types";

export type ClassIndex = {
  id: number;
  name: string;
  facilitator_id: number;
};

const getSessions = (): Promise<Session[]> => APIUtils.get("/sessions");
const getClasses = (id: number): Promise<ClassIndex[]> =>
  APIUtils.get(`/sessions/${id}/classes`);

export default { getSessions, getClasses };
