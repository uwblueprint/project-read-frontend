import React from "react";

import { AppBar, Button, IconButton, Toolbar } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import { AccountCircle } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

import app from "firebase/config";

const useStyles = makeStyles(() => ({
  navbar: {
    backgroundColor: "#F3F3F3",
  },
}));

function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const classes = useStyles();
  const history = useHistory();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar className={classes.navbar}>
      <Toolbar>
        <div style={{ marginLeft: "auto" }}>
          <Button onClick={() => history.push("/")}>All registrations</Button>
          <Button onClick={() => history.push("/sessions")}>Sessions</Button>
          <IconButton edge="end" aria-label="account" onClick={handleClick}>
            <AccountCircle />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                app.auth().signOut();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
