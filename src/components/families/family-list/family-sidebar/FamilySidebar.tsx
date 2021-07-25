import React, { useEffect, useRef, useState } from "react";

import {
  Box,
  Drawer,
  Divider,
  IconButton,
  Typography,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Edit } from "@material-ui/icons";

import { FamilyFormData } from "components/families/family-form/utils";
import DefaultFieldKey from "constants/DefaultFieldKey";

import FamilySidebarForm from "./family-sidebar-form";

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
  family: FamilyFormData;
  isOpen: boolean;
  onClose: () => void;
};

const FamilySidebar = ({ family, isOpen, onClose }: Props) => {
  const classes = useStyles();
  const sidebar = useRef<HTMLDivElement>(null);

  const [familyFormData, setFamilyFormData] = useState<FamilyFormData>(family);
  const [isEditing, setIsEditing] = useState(false);

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

  useEffect(() => {
    setFamilyFormData(family);
  }, [family]);

  const onToggleEdit = (editing: boolean) => {
    if (isEditing) {
      setFamilyFormData(family);
    }
    setIsEditing(editing);
  };

  const handleClose = () => {
    onToggleEdit(false);
    onClose();
  };

  const onSubmitFamilyForm = () => {
    // TODO: make PUT request
    setIsEditing(false);
  };

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
      onClose={handleClose}
      PaperProps={{ ref: sidebar }}
    >
      <Box padding={3} paddingTop={10}>
        <Typography variant="h2">
          {family.parent.first_name} {family.parent.last_name}
        </Typography>
        <Divider variant="fullWidth" />
        <Box position="relative">
          <Box position="absolute" top={0} right={0}>
            <IconButton onClick={() => onToggleEdit(!isEditing)}>
              <Edit />
            </IconButton>
          </Box>
          <Box>
            <FamilySidebarForm
              family={familyFormData}
              isEditing={isEditing}
              onCancel={() => onToggleEdit(false)}
              onChange={setFamilyFormData}
              onSubmit={onSubmitFamilyForm}
            />
          </Box>
        </Box>
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
