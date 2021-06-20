import * as APIUtils from "./APIUtils";
import { Session } from "../types";
import { Class } from "./ClassAPI";

export type ClassIndex = Pick<Class, "id" | "name" | "facilitator_id">;

export type SessionListResponse = Pick<Session, "id" | "season" | "year">;

const getSessions = (): Promise<SessionListResponse[]> =>
  APIUtils.get("/sessions");
const getClasses = (id: number): Promise<ClassIndex[]> =>
  APIUtils.get(`/sessions/${id}/classes`);

export default { getSessions, getClasses };
