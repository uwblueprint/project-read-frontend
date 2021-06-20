import * as APIUtils from "./APIUtils";
import { Session } from "../types";

export type ClassIndex = {
  id: number;
  name: string;
  facilitator_id: number;
};

export type SessionListResponse = Pick<Session, "id" | "season" | "year">;

const getSessions = (): Promise<SessionListResponse[]> =>
  APIUtils.get("/sessions");
const getClasses = (id: number): Promise<ClassIndex[]> =>
  APIUtils.get(`/sessions/${id}/classes`);

export default { getSessions, getClasses };
