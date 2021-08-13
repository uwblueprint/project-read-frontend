import * as APIUtils from "./APIUtils";
import {
  EnrolmentFamilyRequest,
  EnrolmentFamilyResponse,
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

const postEnrolment = (
  data: EnrolmentFamilyRequest
): Promise<EnrolmentFamilyResponse> =>
  APIUtils.post("/enrolments/", data) as Promise<EnrolmentFamilyResponse>;

const putEnrolment = (data: EnrolmentRequest): Promise<EnrolmentResponse> =>
  APIUtils.put(`/enrolments/${data.id}/`, data) as Promise<EnrolmentResponse>;

export default {
  postEnrolment,
  putEnrolment,
};
