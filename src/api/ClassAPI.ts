import * as APIUtils from "./APIUtils";
import { Class } from "../types";

const getClass = (id: number): Promise<Class> => APIUtils.get(`/classes/${id}`);

export default { getClass };
