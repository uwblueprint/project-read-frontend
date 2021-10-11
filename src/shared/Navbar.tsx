import React from "react";

import { AppBar, Button, IconButton, Toolbar } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import { AccountCircle } from "@material-ui/icons";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { Link, useHistory } from "react-router-dom";

import ClassesAPI from "api/ClassAPI";
import FieldsAPI from "api/DynamicFieldAPI";
import EnrolmentAPI from "api/EnrolmentAPI";
import FamilyAPI from "api/FamilyAPI";
import SessionAPI from "api/SessionAPI";
import StudentAPI from "api/StudentAPI";
import app from "firebase/config";

const useStyles = makeStyles((theme) => ({
  link: {
    color: theme.palette.text.primary,
    textDecoration: "none",
  },
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

  const handleExport = async () => {
    const zip = new JSZip();
    zip.file("families.csv", await FamilyAPI.exportFamilies());
    zip.file("fields.csv", await FieldsAPI.exportFields());
    zip.file("sessions.csv", await SessionAPI.exportSessions());
    zip.file("students.csv", await StudentAPI.exportStudents());
    zip.file("classes.csv", await ClassesAPI.exportClasses());
    zip.file("enrolments.csv", await EnrolmentAPI.exportEnrolments());
    zip.folder("attendance");
    (await SessionAPI.getSessions()).forEach((session) => {
      session.classes.forEach((classObj) => {
        zip.file(
          `attendance/${session.name} - ${classObj.name} - Attendance.csv`,
          ClassesAPI.exportClassAttendance(classObj.id)
        );
      });
    });
    zip
      .generateAsync({ type: "blob" })
      .then((content) => saveAs(content, "data.zip"));
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
            onClick={handleClose}
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
            <Link to="/users" className={classes.link}>
              <MenuItem>Manage users</MenuItem>
            </Link>
            <Link to="/fields" className={classes.link}>
              <MenuItem>Configure global questions</MenuItem>
            </Link>
            <MenuItem onClick={handleExport}>Export data</MenuItem>
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
