import * as APIUtils from "./APIUtils";
import { EnrolmentFamilyRequest } from "./types";

const postEnrolment = (data: EnrolmentFamilyRequest) =>
  APIUtils.post("/enrolments/", data);

export default {
  postEnrolment,
};
