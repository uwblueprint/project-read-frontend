import * as APIUtils from "./APIUtils";

const exportStudents = (): Promise<string> =>
  APIUtils.get(`/export/students`, true) as Promise<string>;

export default { exportStudents };
