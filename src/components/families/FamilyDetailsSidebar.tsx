import React, { useEffect, useState, useContext } from "react";
import { Drawer, Divider, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DefaultFamilyFormFields } from "../../constants/DefaultFields";
import { DynamicFieldsContext } from "../../context/DynamicFieldsContext";
import FamilyAPI, { FamilyDetailResponse } from "../../api/FamilyAPI";

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
    paddingBottom: 16,
  },
}));

type FamilyDetailsSidebarProps = {
  isOpen: boolean;
  familyId: number;
  handleClose: () => void;
};

const FamilyDetailsSidebar = ({
  isOpen,
  familyId,
  handleClose,
}: FamilyDetailsSidebarProps) => {
  const { parentDynamicFields } = useContext(DynamicFieldsContext);
  const [family, setFamily] = useState<FamilyDetailResponse>();
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
      {family && (
        <div>
          <Typography variant="h2">
            {family.parent.first_name} {family.parent.last_name}
          </Typography>
          <Divider variant="fullWidth" />
          <Typography variant="h3">Basic Information</Typography>
          {DefaultFamilyFormFields.map((defaultField) => (
            <Typography
              variant="body2"
              className={classes.pb}
              key={defaultField.name}
            >
              <b>{defaultField.name}:</b> {(family as any)[defaultField.id]}
            </Typography>
          ))}
          {parentDynamicFields.map((parentField) => (
            <Typography
              variant="body2"
              className={classes.pb}
              key={parentField.id}
            >
              <b>{parentField.name}:</b>{" "}
              {family.parent.information[parentField.id]}
            </Typography>
          ))}
        </div>
      )}
    </Drawer>
  );
};

export default FamilyDetailsSidebar;
