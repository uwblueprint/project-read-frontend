import * as APIUtils from "./APIUtils";
import { SessionListResponse, SessionDetailResponse } from "./types";

const getSessions = (): Promise<SessionListResponse[]> =>
  APIUtils.get("/sessions") as Promise<SessionListResponse[]>;

const getSession = (id: number): Promise<SessionDetailResponse> =>
  APIUtils.get(`/sessions/${id}`) as Promise<SessionDetailResponse>;

const exportSessions = (): Promise<string> =>
  APIUtils.get(`/export/sessions`) as Promise<string>;

export default { getSessions, getSession, exportSessions };
