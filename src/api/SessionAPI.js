import * as APIUtils from "./APIUtils";

export default {
  getSessions: () => APIUtils.get("/sessions"),
  getClasses: (id) => APIUtils.get(`/sessions/${id}/classes`),
};
