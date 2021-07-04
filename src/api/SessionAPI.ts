import { Class, Session } from "types";

import * as APIUtils from "./APIUtils";
import { SessionListResponse, SessionDetailResponse } from "./types";

const getSessions = (): Promise<SessionListResponse[]> =>
  APIUtils.get("/sessions");

const getSession = (id: number): Promise<SessionDetailResponse> =>
  APIUtils.get(`/sessions/${id}`);

export default { getSessions, getSession };
