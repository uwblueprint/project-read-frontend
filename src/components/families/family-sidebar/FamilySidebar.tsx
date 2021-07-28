import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  Box,
  Drawer,
  Divider,
  IconButton,
  Typography,
  Button,
  InputBase,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Add, Edit } from "@material-ui/icons";
import debounce from "lodash/debounce";
import moment from "moment";

import {
  FamilyDetailResponse,
  FamilyRequest,
  EnrolmentRequest,
} from "api/types";
import {
  FamilyFormData,
  familyResponseToFamilyFormData,
} from "components/families/family-form/utils";

import EnrolmentForm from "./enrolment-form";
import FamilySidebarCard from "./family-sidebar-card";
import FamilySidebarForm, { familySidebarFormId } from "./family-sidebar-form";

const drawerWidth = 416;

const useStyles = makeStyles((theme) => ({
  actionButton: {
    backgroundColor: theme.palette.backgroundSecondary.default,
    borderRadius: 8,
    height: 40,
    width: 40,
  },
  actionButtonIcon: {
    height: 20,
    width: 20,
  },
  drawer: {
    width: drawerWidth,
  },
  drawerPaper: {
    backgroundColor: theme.palette.backgroundSecondary.paper,
    borderLeft: "none",
    height: "calc(100% - 64px)",
    marginTop: 64,
    width: drawerWidth,
  },
  formActionRow: {
    backgroundColor: theme.palette.backgroundSecondary.paper,
    boxShadow: "rgb(0 0 0 / 12%) 8px 0px 8px 0px",
    zIndex: theme.zIndex.appBar + 1,
  },
  heading: {
    fontWeight: 700,
    fontSize: 16,
    paddingBottom: 20,
    paddingTop: 20,
  },
  notes: {
    alignItems: "baseline",
    backgroundColor: theme.palette.backgroundSecondary.default,
    borderRadius: 4,
    fontSize: 14,
    height: "fit-content",
    minHeight: 150,
    padding: 16,
  },
  notesLabel: {
    display: "none",
  },
  submitButton: {
    marginLeft: 12,
    marginRight: 24,
  },
}));

type Props = {
  family: FamilyDetailResponse;
  isOpen: boolean;
  onEditCurrentEnrolment: (enrolment: EnrolmentRequest) => void;
  onEditFamily: (family: FamilyRequest) => void;
  onClose: () => void;
};

const FamilySidebar = ({
  family,
  isOpen,
  onClose,
  onEditCurrentEnrolment,
  onEditFamily,
}: Props) => {
  const classes = useStyles();
  const sidebar = useRef<HTMLDivElement>(null);

  const [familyFormData, setFamilyFormData] = useState<FamilyFormData>(
    familyResponseToFamilyFormData(family)
  );
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

  const resetFormData = () => {
    setFamilyFormData(familyResponseToFamilyFormData(family));
  };

  useEffect(() => {
    resetFormData();
  }, [family]);

  const onToggleEdit = (editing: boolean) => {
    if (isEditing) {
      resetFormData();
    }
    setIsEditing(editing);
  };

  const onSubmitFamilyForm = () => {
    // TODO: make PUT request
    setIsEditing(false);
  };

  const debouncedSaveFamily = useCallback(
    debounce(async (data: FamilyRequest) => {
      onEditFamily(data);
    }, 500),
    []
  );

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
      onClose={() => {
        onToggleEdit(false);
        onClose();
      }}
      PaperProps={{ ref: sidebar }}
    >
      <Box padding={3} paddingBottom={isEditing ? 10 : 3}>
        <Typography variant="h2">
          {family.parent.first_name} {family.parent.last_name}
        </Typography>

        <Typography variant="h3" className={classes.heading}>
          Enrolment
        </Typography>
        <EnrolmentForm
          enrolment={family.current_enrolment}
          onChange={onEditCurrentEnrolment}
        />

        <Box paddingTop={2}>
          <Divider />
        </Box>

        <Box position="relative">
          <Box position="absolute" top={8} right={0}>
            <IconButton
              className={classes.actionButton}
              onClick={() => onToggleEdit(!isEditing)}
            >
              <Edit />
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

        <Box position="relative">
          <Box position="absolute" top={8} right={0}>
            <IconButton className={classes.actionButton}>
              <Add />
            </IconButton>
          </Box>
          <Box>
            <Typography variant="h3" className={classes.heading}>
              Recent interactions
            </Typography>
            {family.interactions.map((interaction) => (
              <FamilySidebarCard
                title={
                  <Typography variant="body2">{interaction.type}</Typography>
                }
                content={
                  <Typography variant="body2">
                    {interaction.user.first_name}{" "}
                    {interaction.user.last_name.charAt(0)}. -{" "}
                    {moment(interaction.date, "YYYY-MM-DD").format(
                      "MMM. D, YYYY"
                    )}
                  </Typography>
                }
              />
            ))}
          </Box>
        </Box>

        <Typography variant="h3" className={classes.heading}>
          Notes
        </Typography>
        <InputBase
          className={classes.notes}
          defaultValue=""
          fullWidth
          inputProps={{ "aria-label": "notes" }}
          multiline
          onChange={(e) => {
            setFamilyFormData({ ...familyFormData, notes: e.target.value });
            debouncedSaveFamily({
              ...family,
              notes: e.target.value,
            });
          }}
          value={familyFormData.notes}
        />
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
