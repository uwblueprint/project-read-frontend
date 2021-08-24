import EnrolmentAPI from "api/EnrolmentAPI";
import { EnrolmentRequest, EnrolmentResponse } from "api/types";

const saveEnrolments = async (
  enrolments: EnrolmentResponse[],
  data: EnrolmentRequest
) => {
  const enrolmentsData = [...enrolments];
  const index = enrolments.findIndex((enrolment) => enrolment.id === data.id);
  enrolmentsData[index] = await EnrolmentAPI.putEnrolment(data);
  return enrolmentsData;
};

export default saveEnrolments;
