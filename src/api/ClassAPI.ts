import * as APIUtils from "./APIUtils";
import { ClassDetailResponse, ClassDetailRequest } from "./types";

const getClass = (id: number): Promise<ClassDetailResponse> =>
  APIUtils.get(`/classes/${id}`) as Promise<ClassDetailResponse>;

const putClass = (data: ClassDetailRequest): Promise<ClassDetailResponse> =>
  APIUtils.put(`/classes/${data.id}/`, data) as Promise<ClassDetailResponse>;

export default { getClass, putClass };
