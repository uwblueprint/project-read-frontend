import React, { useEffect, useState, useContext } from "react";
import { Drawer, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
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
  divider: {
    background: "black",
  },
}));

// function ParentInfo(parentFields, parentData) {
//   // parentFields.map((parentField) => console.log(parentField));

//   const parentInfo = parentFields.map((parentField, index) => (
//     <p key={parentField?.id}>
//       <b>{parentField?.name}:</b>{" "}
//       {parentData.parent?.information[`${index - 1}`]}
//     </p>
//   ));
//   return (
//     <div>
//       {parentInfo}: {parentData.home_number}
//     </div>
//   );
// }
function FamilyDetailsSidebar({ isOpen, familyId, handleClose }) {
  const { parentFields } = useContext(FieldsContext);
  const [family, setFamily] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    async function fetchFamily() {
      setFamily(await FamilyAPI.getFamilyById(familyId));
    }
    if (familyId) fetchFamily();
  }, [familyId]);

  const parentInfo = parentFields.map((parentField, index) => (
    <p key={parentField?.id}>
      <b>{parentField?.name}:</b>{" "}
      {family?.parent?.information[`${index + 1}`] ?? ""}
    </p>
  ));

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
      <h2>
        {family?.parent?.first_name} {family?.parent?.last_name}
      </h2>
      <Divider
        variant="fullWidth"
        classes={{
          root: classes.divider,
        }}
      />
      <h3>Basic Information</h3>
      {parentInfo}
      <p>
        <b>Home phone:</b>
        {family?.home_number}
      </p>
      <p>
        <b>Cell phone:</b> {family?.cell_number}
      </p>
      <p>
        <b>Work phone:</b> {family?.work_number}
      </p>
      <p>
        <b>Email:</b> {family?.email}
      </p>
      <p>
        <b>Mailing address:</b> {family?.address}
      </p>
      <p>
        <b>Preferred contact:</b> {family?.preferred_comms}
      </p>
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
