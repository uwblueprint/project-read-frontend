import React, { useEffect, useState, createContext, ReactNode } from "react";

import { UserResponse } from "api/types";
import UserAPI from "api/UserAPI";

type UsersContextData = {
  currentUser: UserResponse | null;
  users: UserResponse[];
};

export const UsersContext = createContext<UsersContextData>({
  currentUser: null,
  users: [],
});

type UsersProviderProps = {
  children: ReactNode;
};

export const UsersProvider = ({ children }: UsersProviderProps) => {
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
  const [users, setUsers] = useState<UserResponse[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      setCurrentUser(await UserAPI.getMe());
      setUsers(await UserAPI.getUsers());
    }
    fetchUsers();
  }, []);

  if (!currentUser) {
    return null;
  }

  return (
    <UsersContext.Provider value={{ currentUser, users }}>
      {children}
    </UsersContext.Provider>
  );
};
