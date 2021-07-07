import React from "react";

import { AppBar, Button, IconButton, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AccountCircle } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(() => ({
  navbar: {
    backgroundColor: "#F3F3F3",
  },
}));

function Navbar() {
  const classes = useStyles();
  const history = useHistory();

  return (
    <AppBar className={classes.navbar}>
      <Toolbar>
        <div style={{ marginLeft: "auto" }}>
          <Button onClick={() => history.push("/")}>All registrations</Button>
          <Button onClick={() => history.push("/sessions")}>Sessions</Button>
          <IconButton edge="end" aria-label="account">
            <AccountCircle />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
