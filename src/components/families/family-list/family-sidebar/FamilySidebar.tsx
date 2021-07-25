import React, { useEffect, useRef, useState } from "react";

import {
  Box,
  Drawer,
  Divider,
  IconButton,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Edit } from "@material-ui/icons";

import { FamilyFormData } from "components/families/family-form/utils";
import DefaultFieldKey from "constants/DefaultFieldKey";

import FamilySidebarForm, { familySidebarFormId } from "./family-sidebar-form";

const drawerWidth = 416;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
  },
  drawerPaper: {
    backgroundColor: "#F5F5F5",
    borderLeft: "none",
    height: "calc(100% - 64px)",
    marginTop: 64,
    width: drawerWidth,
  },
  editButton: {
    borderRadius: 8,
    height: 40,
    width: 40,
  },
  editButtonIcon: {
    height: 20,
    width: 20,
  },
  formActionRow: {
    backgroundColor: "#F5F5F5",
    boxShadow: "rgb(0 0 0 / 12%) 8px 0px 8px 0px",
    zIndex: theme.zIndex.appBar + 1,
  },
  heading: {
    color: "#42526E",
    fontWeight: 700,
    fontSize: 16,
    paddingBottom: 20,
    paddingTop: 20,
  },
  submitButton: {
    marginLeft: 12,
    marginRight: 24,
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
      <Box padding={3} paddingBottom={isEditing ? 10 : 3}>
        <Typography variant="h2">
          {family.parent.first_name} {family.parent.last_name}
        </Typography>
        <Divider variant="fullWidth" />
        <Box position="relative">
          <Box position="absolute" top={8} right={0}>
            <IconButton
              className={classes.editButton}
              onClick={() => onToggleEdit(!isEditing)}
            >
              <Edit className={classes.editButtonIcon} />
            </IconButton>
          </Box>
          <Box>
            <FamilySidebarForm
              family={familyFormData}
              isEditing={isEditing}
              onChange={setFamilyFormData}
              onSubmit={onSubmitFamilyForm}
            />
          </Box>
        </Box>

        {!isEditing && (
          <Box paddingTop={2}>
            <Divider />
          </Box>
        )}

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
      {isEditing && (
        <Box
          alignContent="end"
          bottom={0}
          className={classes.formActionRow}
          display="flex"
          justifyContent="flex-end"
          paddingY={2}
          position="fixed"
          width={drawerWidth}
        >
          <Button
            onClick={() => onToggleEdit(false)}
            type="button"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            className={classes.submitButton}
            form={familySidebarFormId}
            type="submit"
            variant="contained"
          >
            Save
          </Button>
        </Box>
      )}
    </Drawer>
  );
};

export default FamilySidebar;
