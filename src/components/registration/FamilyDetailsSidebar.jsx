import React from "react";
import { Drawer } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const drawerWidth = 250;

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
  },
  h3: {
    padding: "20px",
    width: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
  },
}));

function FamilyDetailsSidebar({ isOpen, rowData, handleClose }) {
  const classes = useStyles();
  const firstName = rowData[0];
  const lastName = rowData[1];
  return (
    <Drawer
      anchor="right"
      variant="temporary"
      className={classes.drawer}
      open={isOpen}
      onClose={handleClose}
    >
      <h3 className={classes.h3}>
        Hey {firstName} {lastName}!
      </h3>
    </Drawer>
  );
}

FamilyDetailsSidebar.defaultProps = {
  isOpen: false,
  handleClose: () => {},
};

FamilyDetailsSidebar.propTypes = {
  isOpen: PropTypes.bool,
  rowData: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleClose: PropTypes.func,
};

export default FamilyDetailsSidebar;
