import React, { useEffect, useState } from "react";
import { Drawer } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import FamilyAPI from "../../api/FamilyAPI";

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
  const [family, setFamily] = useState({
    parent: { first_name: "", last_name: "" },
  });
  const classes = useStyles();

  useEffect(() => {
    async function fetchFamily() {
      setFamily(await FamilyAPI.getFamilyById(rowIndex + 1));
    }
    fetchFamily();
  }, [rowIndex]);

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
      <h3>
        Hey {family.parent.first_name} {family.parent.last_name}!
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
  rowIndex: PropTypes.number.isRequired,
  handleClose: PropTypes.func,
};

export default FamilyDetailsSidebar;
