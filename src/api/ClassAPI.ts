import * as APIUtils from "./APIUtils";
import {
  ClassDetailResponse,
  ClassDetailRequest,
  ClassListResponse,
  ClassListRequest,
} from "./types";

const getClass = (id: number): Promise<ClassDetailResponse> =>
  APIUtils.get(`/classes/${id}`) as Promise<ClassDetailResponse>;

const postClass = (data: ClassListRequest): Promise<ClassListResponse> =>
  APIUtils.post(`/classes/`, data) as Promise<ClassListResponse>;

const putClass = (data: ClassDetailRequest): Promise<ClassDetailResponse> =>
  APIUtils.put(`/classes/${data.id}/`, data) as Promise<ClassDetailResponse>;

const exportClassAttendance = (id: number): Promise<string> =>
  APIUtils.get(`/export/attendances?class_id=${id}`, true) as Promise<string>;

const exportClasses = (): Promise<string> =>
  APIUtils.get("/export/classes", true) as Promise<string>;

export default {
  getClass,
  postClass,
  putClass,
  exportClassAttendance,
  exportClasses,
};
