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

function FamilyDetailsSidebar({ isOpen, familyId, handleClose }) {
  const [family, setFamily] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    async function fetchFamily() {
      setFamily(await FamilyAPI.getFamilyById(familyId));
    }
    if (familyId) fetchFamily();
  }, [familyId]);

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
        Hey {family?.parent?.first_name ?? ""} {family?.parent?.last_name ?? ""}
        !
      </h3>
    </Drawer>
  );
}

FamilyDetailsSidebar.defaultProps = {
  isOpen: false,
  familyId: null,
  handleClose: () => {},
};

FamilyDetailsSidebar.propTypes = {
  isOpen: PropTypes.bool,
  familyId: PropTypes.number,
  handleClose: PropTypes.func,
};

export default FamilyDetailsSidebar;
