import * as APIUtils from "./APIUtils";
import {
  DynamicFieldRequest,
  DynamicFieldResponse,
  DynamicFieldsResponse,
} from "./types";

const getFields = async (): Promise<DynamicFieldsResponse> => {
  const res = (await APIUtils.get("/fields")) as DynamicFieldsResponse[];
  return res[0]; // API returns the content as the first element of an array
};

const putField = async (
  data: DynamicFieldRequest
): Promise<DynamicFieldResponse> =>
  (await APIUtils.put(`/fields/${data.id}`, data)) as DynamicFieldResponse;

export default { getFields, putField };
