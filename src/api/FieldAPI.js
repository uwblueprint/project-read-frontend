import * as APIUtils from "./APIUtils";

export default {
  getFields: () => APIUtils.get("/fields"),
};
