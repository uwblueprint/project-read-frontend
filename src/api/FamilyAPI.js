import * as APIUtils from "./APIUtils";

export default {
  getFamilies: () => APIUtils.get("/families/"),
  getFamilyById: (id) => APIUtils.get(`/families/${id}`),
  postFamily: (data) => APIUtils.post("/families/", data),
};
