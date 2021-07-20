import * as APIUtils from "./APIUtils";
import { ClassDetailResponse, ClassRequest } from "./types";

const getClass = (id: number): Promise<ClassDetailResponse> =>
  APIUtils.get(`/classes/${id}`) as Promise<ClassDetailResponse>;

const putClass = (data: ClassRequest): Promise<ClassDetailResponse> =>
  APIUtils.put(`/classes/${data.id}/`, data);

export default { getClass, putClass };
