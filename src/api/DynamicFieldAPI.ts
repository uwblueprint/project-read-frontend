import { DynamicField } from "../types";
import * as APIUtils from "./APIUtils";

export type DynamicFieldsResponse = {
  parent_fields: DynamicField[];
  child_fields: DynamicField[];
  guest_fields: DynamicField[];
};

const getFields = async (): Promise<DynamicFieldsResponse> => {
  const res: DynamicFieldsResponse[] = await APIUtils.get("/fields");
  return res[0]; // API returns the content as the first element of an array
};

export default { getFields };
