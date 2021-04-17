import React from "react";
import { Drawer } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
// import getFamilyById from "../../api/FamilyAPI";

const drawerWidth = 250;

const useStyles = makeStyles(() => ({
  drawer: {
    width: drawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
    padding: 20,
  },
}));

function FamilyDetailsSidebar({ isOpen, rowIndex, handleClose }) {
  const classes = useStyles();
  // useEffect(() => {
  //   getFamilyById(rowData);
  // }, []);
  // const firstName = rowData[0];
  // const lastName = rowData[1];
  return (
    <Drawer
      anchor="right"
      variant="temporary"
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      open={isOpen}
      onClose={handleClose}
    >
      <h3>Hey {rowIndex + 1}!</h3>
    </Drawer>
  );
}

FamilyDetailsSidebar.defaultProps = {
  isOpen: false,
  handleClose: () => {},
};

FamilyDetailsSidebar.propTypes = {
  isOpen: PropTypes.bool,
  rowIndex: PropTypes.number.isRequired,
  handleClose: PropTypes.func,
};

export default FamilyDetailsSidebar;
