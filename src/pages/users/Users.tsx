import React, { useContext } from "react";

import {
  Button,
  MenuItem,
  Paper,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import moment from "moment";

import FormRow from "components/common/form-row";
import FieldVariant from "constants/FieldVariant";
import QuestionType from "constants/QuestionType";
import { UsersContext } from "context/UsersContext";

import useStyles from "./styles";

enum UserRole {
  Admin = "Admin",
  Facilitator = "Facilitator",
}

const Users = () => {
  const classes = useStyles();
  const { users } = useContext(UsersContext);
  return (
    <>
      <Typography variant="h1">Manage users</Typography>
      <TableContainer
        className={classes.tableContainer}
        component={Paper}
        elevation={0}
      >
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
              <TableCell>{user.email}</TableCell>
              <TableCell className={classes.roleSelectTabelCell}>
                <FormRow
                  id={`${user.id} role`}
                  label={`${user.id} role`}
                  multiple={false}
                  questionType={QuestionType.SELECT}
                  variant={FieldVariant.COMPACT}
                >
                  <Select
                    aria-label={`${user.id} role`}
                    className={classes.roleSelect}
                    disabled // TODO: enable when put endpoint is ready
                    disableUnderline
                    displayEmpty
                    fullWidth
                    labelId={`${user.id} role`}
                    onChange={() => {
                      // TODO: call put endpoint
                    }}
                    value={
                      user.is_admin ? UserRole.Admin : UserRole.Facilitator
                    }
                  >
                    <MenuItem
                      className={classes.roleSelect}
                      value={UserRole.Admin}
                    >
                      {UserRole.Admin}
                    </MenuItem>
                    <MenuItem
                      className={classes.roleSelect}
                      value={UserRole.Facilitator}
                    >
                      {UserRole.Facilitator}
                    </MenuItem>
                  </Select>
                </FormRow>
              </TableCell>
              <TableCell>
                {moment(user.date_joined).format("MMMM D, YYYY")}
              </TableCell>
              <TableCell>{user.is_active ? "Active" : "Inactive"}</TableCell>
              <TableCell>
                <Button
                  className={classes.activationButton}
                  disabled // TODO: enable when put endpoint is ready
                  onClick={() => {
                    // TODO: call put endpoint
                  }}
                >
                  {user.is_active ? "Deactivate" : "Activate"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </TableContainer>
    </>
  );
};

export default Users;
