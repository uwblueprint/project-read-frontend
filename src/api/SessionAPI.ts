import * as APIUtils from "./APIUtils";
import { Class, Session } from "../types";
import { FamilyListResponse } from "./FamilyAPI";

export type ClassListResponse = Pick<Class, "id" | "name">;

export type SessionListResponse = Pick<Session, "id" | "season" | "year">;

export type SessionDetailResponse = Session & {
  classes: ClassListResponse[];
  families: FamilyListResponse[];
};

const getSessions = (): Promise<SessionListResponse[]> =>
  APIUtils.get("/sessions");

const getSession = (id: number): Promise<SessionDetailResponse> =>
  APIUtils.get(`/sessions/${id}`);

export default { getSessions, getSession };
