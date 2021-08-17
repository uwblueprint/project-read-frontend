import * as APIUtils from "./APIUtils";
import { UserResponse } from "./types";

const getMe = (): Promise<UserResponse> =>
  APIUtils.get("/users/me/") as Promise<UserResponse>;

const getUsers = (): Promise<UserResponse[]> =>
  APIUtils.get("/users") as Promise<UserResponse[]>;

export default { getMe, getUsers };
