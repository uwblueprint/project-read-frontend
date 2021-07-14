import React, { useContext } from "react";

import { Drawer, Divider, Typography, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { FamilyDetailResponse } from "api/types";
import DefaultFieldKey from "constants/DefaultFieldKey";
import { DefaultFamilyFormFields } from "constants/DefaultFields";
import { DynamicFieldsContext } from "context/DynamicFieldsContext";

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

type Props = {
  isOpen: boolean;
  family: FamilyDetailResponse;
  onClose: () => void;
};

const FamilySidebar = ({ isOpen, family, onClose }: Props) => {
  const classes = useStyles();
  const { parentDynamicFields } = useContext(DynamicFieldsContext);

  return (
    <Drawer
      anchor="right"
      variant="temporary"
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      open={isOpen}
      onClose={onClose}
    >
      <div>
        <Typography variant="h2">
          {family.parent.first_name} {family.parent.last_name}
        </Typography>
        <Divider variant="fullWidth" />
        <Typography variant="h3" className={classes.heading}>
          Basic Information
        </Typography>
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
    </Drawer>
  );
};

export default FamilySidebar;
