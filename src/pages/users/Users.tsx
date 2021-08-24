import React, { useContext } from "react";

import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";

import { UsersContext } from "context/UsersContext";

const Users = () => {
  const { users } = useContext(UsersContext);
  return (
    <>
      <Typography variant="h1">Manage users</Typography>
      <TableContainer component={Paper} elevation={0}>
        <Table aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Date added</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Activation</TableCell>
            </TableRow>
          </TableHead>
          {users.map((user) => (
            <TableRow>
              <TableCell>email {user.id}</TableCell>
              <TableCell>role</TableCell>
              <TableCell>date added</TableCell>
              <TableCell>status</TableCell>
              <TableCell />
            </TableRow>
          ))}
        </Table>
      </TableContainer>
    </>
  );
};

export default Users;
