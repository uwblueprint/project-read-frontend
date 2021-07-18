import React, { useContext, useEffect, useRef } from "react";

import { Box, Drawer, Divider, Typography, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { FamilyDetailResponse } from "api/types";
import DefaultFieldKey from "constants/DefaultFieldKey";
import { DefaultFamilyFormFields } from "constants/DefaultFields";
import { DynamicFieldsContext } from "context/DynamicFieldsContext";

const drawerWidth = 416;

const useStyles = makeStyles(() => ({
  drawer: {
    width: drawerWidth,
  },
  drawerPaper: {
    backgroundColor: "#F5F5F5",
    borderLeft: "none",
    width: drawerWidth,
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
  const sidebar = useRef<HTMLDivElement>(null);

  const handleClick = (e: MouseEvent) => {
    const sidebarRef = sidebar?.current;
    if (!sidebarRef || !isOpen) {
      return;
    }
    const sidebarX = sidebarRef.getBoundingClientRect().x || 0;
    const clickX = e.clientX;
    if (clickX < sidebarX) {
      sidebarRef.scrollTo(0, 0);
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => {
        document.removeEventListener("mousedown", handleClick);
      };
    }
    return () => {};
  }, [isOpen]);

  return (
    <Drawer
      anchor="right"
      // temporary can't be used due to an incompatibility with Chrome and
      // mui-datatable's sticky headers, leading to unexpected scroll behaviour
      // instead, we use persistent and capture clicks ourselves
      variant="persistent"
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      open={isOpen}
      onClose={onClose}
      PaperProps={{ ref: sidebar }}
    >
      <Box padding={3} paddingTop={10}>
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
      </Box>
    </Drawer>
  );
};

export default FamilySidebar;
