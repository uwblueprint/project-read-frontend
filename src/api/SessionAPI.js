import * as APIUtils from "./APIUtils";

export default {
  getSessions: () => APIUtils.get("/sessions"),
};
