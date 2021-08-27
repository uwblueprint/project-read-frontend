import React, { useContext, useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { Add, Close } from "@material-ui/icons/";
import moment from "moment";

import { UserRequest } from "api/types";
import FormRow from "components/common/form-row";
import FieldVariant from "constants/FieldVariant";
import QuestionType from "constants/QuestionType";
import { UsersContext } from "context/UsersContext";

import useStyles from "./styles";

enum UserRole {
  Admin = "Admin",
  Facilitator = "Facilitator",
}

const defaultUserData: UserRequest = {
  email: "",
  is_admin: false,
};

const Users = () => {
  const classes = useStyles();
  const { users } = useContext(UsersContext);
  const [displayInviteDialog, setIsDisplayInviteDialog] = useState(false);
  const [newUser, setNewUser] = useState(defaultUserData);

  const handleOpenInviteDialog = () => {
    setIsDisplayInviteDialog(true);
  };

  const handleCloseInviteDialog = () => {
    setNewUser(defaultUserData);
    setIsDisplayInviteDialog(false);
  };

  const convertBooleanToRole = (isAdmin: boolean) =>
    isAdmin ? UserRole.Admin : UserRole.Facilitator;
  const convertRoleToBoolean = (role: UserRole) => role === UserRole.Admin;

  const inviteUser = () => {
    console.log(newUser);
    // Call POST users API here
  };

  return (
    <>
      <Box display="flex">
        <Box display="flex" flexGrow={1} alignItems="center">
          <Typography variant="h1">Manage users</Typography>
        </Box>
        <Box flexShrink={0}>
          <Button
            variant="outlined"
            className={classes.registerButton}
            onClick={handleOpenInviteDialog}
          >
            Invite &nbsp;
            <Add />
          </Button>
        </Box>
      </Box>
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
      <Dialog
        open={displayInviteDialog}
        onClose={handleCloseInviteDialog}
        disableBackdropClick
        fullWidth
        maxWidth="md"
      >
        <DialogTitle disableTypography>
          <Typography variant="h2">Invite a member</Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseInviteDialog}
            className={classes.closeButton}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box marginBottom={4}>
            Send an invite to another member through email.
          </Box>
          <Box marginBottom={4} width={488}>
            <FormRow
              id="email"
              label="Name"
              questionType={QuestionType.TEXT}
              variant={FieldVariant.DEFAULT}
            >
              <OutlinedInput
                autoComplete="new-password" // disable autocomplete
                fullWidth
                id="email"
                placeholder="Email address"
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    email: e.target.value,
                  })
                }
                value={newUser.email}
              />
            </FormRow>
            <FormRow
              id="role"
              label="Role"
              questionType={QuestionType.SELECT}
              variant={FieldVariant.DEFAULT}
            >
              <Select
                aria-label="Class facilitator"
                displayEmpty
                fullWidth
                labelId="role"
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    is_admin: convertRoleToBoolean(e.target.value as UserRole),
                  })
                }
                value={convertBooleanToRole(newUser.is_admin)}
                variant="outlined"
              >
                <MenuItem value={UserRole.Facilitator}>Facilitator</MenuItem>
                <MenuItem value={UserRole.Admin}>Admin</MenuItem>
              </Select>
            </FormRow>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Box marginRight={1}>
              <Button variant="contained" onClick={handleCloseInviteDialog}>
                Cancel
              </Button>
            </Box>
            <Button variant="contained" color="primary" onClick={inviteUser}>
              Send Invite
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Users;
