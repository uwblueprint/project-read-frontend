import * as APIUtils from "./APIUtils";
import { UserRequest, UserResponse } from "./types";

const getMe = (): Promise<UserResponse> =>
  APIUtils.get("/users/me/") as Promise<UserResponse>;

const getUsers = (): Promise<UserResponse[]> =>
  APIUtils.get("/users") as Promise<UserResponse[]>;

const postUser = (user: UserRequest): Promise<UserResponse> =>
  APIUtils.post("/users/", user) as Promise<UserResponse>;

export default { getMe, getUsers, postUser };
