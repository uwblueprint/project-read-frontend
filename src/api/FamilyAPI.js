import * as APIUtils from "./APIUtils";

export default {
  getFamilies: () => APIUtils.get("/families"),
};
