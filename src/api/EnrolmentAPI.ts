import * as APIUtils from "./APIUtils";
import {
  EnrolmentFamilyRequest,
  EnrolmentRequest,
  EnrolmentResponse,
} from "./types";

export const enrolmentResponseToRequest = (
  data: EnrolmentResponse
): EnrolmentRequest => ({
  ...data,
  session: data.session.id,
  preferred_class: data.preferred_class?.id || null,
  enrolled_class: data.enrolled_class?.id || null,
});

const postEnrolment = (data: EnrolmentFamilyRequest) =>
  APIUtils.post("/enrolments/", data);

const putEnrolment = (data: EnrolmentRequest) =>
  APIUtils.put(`/enrolments/${data.id}/`, data);

export default {
  postEnrolment,
  putEnrolment,
};
