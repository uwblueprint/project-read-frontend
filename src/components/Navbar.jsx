import React from "react";
import { useHistory } from "react-router-dom";
import { AppBar, Button, IconButton, Toolbar } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";

function Navbar() {
  const history = useHistory();

  return (
    <AppBar>
      <Toolbar>
        <div style={{ marginLeft: "auto" }}>
          <Button onClick={() => history.push("/")}>All registrations</Button>
          <Button onClick={() => history.push("/sessions")}>Sessions</Button>
          <IconButton edge="end" aria-label="account" color="inherit">
            <AccountCircle />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
