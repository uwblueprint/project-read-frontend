import * as APIUtils from "./APIUtils";
import { DynamicFieldsResponse } from "./types";

const getFields = async (): Promise<DynamicFieldsResponse> => {
  const res = (await APIUtils.get("/fields")) as DynamicFieldsResponse[];
  return res[0]; // API returns the content as the first element of an array
};

export default { getFields };
