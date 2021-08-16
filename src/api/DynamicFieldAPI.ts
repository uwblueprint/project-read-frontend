import * as APIUtils from "./APIUtils";
import {
  DynamicFieldRequest,
  DynamicFieldResponse,
  DynamicFieldsResponse,
} from "./types";

const exportFields = (): Promise<string> =>
  APIUtils.get(`/export/fields`) as Promise<string>;

const getFields = async (): Promise<DynamicFieldsResponse> => {
  const res = (await APIUtils.get("/fields")) as DynamicFieldsResponse[];
  return res[0]; // API returns the content as the first element of an array
};

const postField = async (
  data: DynamicFieldRequest
): Promise<DynamicFieldResponse> =>
  (await APIUtils.post(`/fields/`, data)) as DynamicFieldResponse;

const putField = async (
  data: DynamicFieldRequest & { id: number }
): Promise<DynamicFieldResponse> =>
  (await APIUtils.put(`/fields/${data.id}/`, data)) as DynamicFieldResponse;

export default { exportFields, getFields, postField, putField };
