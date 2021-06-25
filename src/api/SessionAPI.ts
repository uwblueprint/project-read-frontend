import * as APIUtils from "./APIUtils";
import { Class, Session } from "../types";

export type ClassListResponse = Pick<Class, "id" | "name">;

export type SessionListResponse = Pick<Session, "id" | "season" | "year">;

const getSessions = (): Promise<SessionListResponse[]> =>
  APIUtils.get("/sessions");

const getSessionClasses = (id: number): Promise<ClassListResponse[]> =>
  APIUtils.get(`/sessions/${id}/classes`);

export default { getSessions, getSessionClasses };
