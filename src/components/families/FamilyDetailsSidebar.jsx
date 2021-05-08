import React, { useEffect, useState, useContext } from "react";
import { Drawer, Divider, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { DefaultFamilyFields } from "../../constants/DefaultFields";
import { FieldsContext } from "../../context/fields";
import FamilyAPI from "../../api/FamilyAPI";

const drawerWidth = 400;

const useStyles = makeStyles(() => ({
  drawer: {
    width: drawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
    padding: 20,
  },
  pb: {
    paddingBottom: 20,
  },
}));

function ParentInfo({ family, classes }) {
  const { parentFields } = useContext(FieldsContext);
  return parentFields.map((parentField) => (
    <Typography variant="body1" className={classes.pb} key={parentField.id}>
      <b>{parentField.name}:</b>{" "}
      {family.parent.information[`${parentField.id}`] ?? ""}
    </Typography>
  ));
}

function DefaultInfo({ family, classes }) {
  return DefaultFamilyFields.map((defaultField) => (
    <Typography variant="body1" className={classes.pb} key={defaultField.name}>
      <b>{defaultField.name}:</b> {family[`${defaultField.id}`] ?? ""}
    </Typography>
  ));
}

function FamilyDetailsSidebar({ isOpen, familyId, handleClose }) {
  const [family, setFamily] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    async function fetchFamily() {
      setFamily(await FamilyAPI.getFamilyById(familyId));
    }
    if (familyId) fetchFamily();
  }, [familyId]);

  return family ? (
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
      <Typography variant="h3">
        {family.parent.first_name} {family.parent.last_name}
      </Typography>
      <Divider variant="fullWidth" />
      <Typography variant="h5" className="pb">
        Basic Information
      </Typography>
      <DefaultInfo family={family} classes={classes} />
      <ParentInfo family={family} classes={classes} />
    </Drawer>
  ) : (
    <Drawer
      anchor="right"
      variant="temporary"
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      open={isOpen}
      onClose={handleClose}
    />
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
