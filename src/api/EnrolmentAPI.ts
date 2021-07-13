import * as APIUtils from "./APIUtils";
import { FamilyEnrolmentRequest } from "./types";

const postEnrolment = (data: FamilyEnrolmentRequest) =>
  APIUtils.post("/enrolments/", data);

export default {
  postEnrolment,
};
