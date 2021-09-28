import * as APIUtils from "./APIUtils";
import {
  SessionDetailResponse,
  SessionListResponse,
  SessionRequest,
} from "./types";

const getSessions = (): Promise<SessionListResponse[]> =>
  APIUtils.get("/sessions") as Promise<SessionListResponse[]>;

const getSession = (id: number): Promise<SessionDetailResponse> =>
  APIUtils.get(`/sessions/${id}`) as Promise<SessionDetailResponse>;

const exportSessions = (): Promise<string> =>
  APIUtils.get(`/export/sessions`, true) as Promise<string>;

const postSession = (data: SessionRequest): Promise<SessionDetailResponse> =>
  APIUtils.post("/sessions/", data) as Promise<SessionDetailResponse>;

export default { getSessions, getSession, exportSessions, postSession };
