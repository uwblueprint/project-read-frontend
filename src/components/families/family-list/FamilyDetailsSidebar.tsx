import React, { useEffect, useState, useContext } from "react";

import {
  Drawer,
  Divider,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { FamilyDetailResponse } from "api/types";
import DefaultFieldKey from "constants/DefaultFieldKey";
import { DynamicFieldsContext } from "context/DynamicFieldsContext";

import FamilyForm, {
  familyResponseToFamilyFormData,
  FamilyStudentFormData,
} from "../family-form";

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
  heading: {
    color: "#42526E",
    fontWeight: 700,
    fontSize: 16,
    paddingBottom: 16,
  },
}));

type FamilyDetailsSidebarProps = {
  isOpen: boolean;
  family: FamilyDetailResponse;
  handleClose: () => void;
};

const FamilyDetailsSidebar = ({
  isOpen,
  family,
  handleClose,
}: FamilyDetailsSidebarProps) => {
  const classes = useStyles();
  const {
    childDynamicFields,
    guestDynamicFields,
    parentDynamicFields,
  } = useContext(DynamicFieldsContext);
  const [familyFormData, setFamilyFormData] = useState<FamilyStudentFormData>();
  const [isEditing, setIsEditing] = useState(false);

  const resetFamilyFormData = () => {
    if (family) {
      setFamilyFormData(familyResponseToFamilyFormData(family));
    }
  };

  useEffect(() => {
    resetFamilyFormData();
  }, [family]);

  const handleToggleEdit = () => {
    if (isEditing) {
      resetFamilyFormData();
    }
    setIsEditing(!isEditing);
  };

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
      {family && familyFormData && (
        <div>
          <Typography variant="h2">
            {family.parent.first_name} {family.parent.last_name}
          </Typography>
          <Divider variant="fullWidth" />
          <Button onClick={handleToggleEdit}>Edit</Button>
          <FamilyForm
            dense
            family={familyFormData}
            isEditing={isEditing}
            childDynamicFields={childDynamicFields}
            guestDynamicFields={guestDynamicFields}
            parentDynamicFields={parentDynamicFields}
            onChange={setFamilyFormData}
          />
          <Typography variant="h3" className={classes.heading}>
            Notes
          </Typography>
          <form>
            <TextField
              id={DefaultFieldKey.NOTES}
              InputLabelProps={{ shrink: true }}
              label="Notes"
              value={(family as any)[DefaultFieldKey.NOTES]}
              fullWidth
              variant="filled"
            />
          </form>
        </div>
      )}
    </Drawer>
  );
};

export default FamilyDetailsSidebar;
