import React, { useContext, useEffect, useRef, useState } from "react";

import {
  Box,
  Drawer,
  Divider,
  IconButton,
  Typography,
  Button,
  InputBase,
} from "@material-ui/core";
import { Add, Edit } from "@material-ui/icons";
import moment from "moment";

import FamilyAPI from "api/FamilyAPI";
import { EnrolmentRequest, FamilyDetailResponse } from "api/types";
import SpinnerOverlay from "components/common/spinner-overlay";
import {
  familyFormDataToFamilyRequest,
  familyResponseToFamilyFormData,
  generateInteractionsKey,
} from "components/families/family-form/utils";
import { UsersContext } from "context/UsersContext";

import { FamilyFormData } from "../family-form/types";
import EnrolmentForm from "./enrolment-form";
import FamilySidebarForm, { familySidebarFormId } from "./family-sidebar-form";
import InteractionCard from "./interaction-card";
import PreviousEnrolmentCard from "./previous-enrolment-card";
import useStyles from "./styles";

type Props = {
  family: FamilyDetailResponse;
  isOpen: boolean;
  onEditEnrolment: (enrolment: EnrolmentRequest) => void;
  onSaveFamily: (family: FamilyDetailResponse, refetch: boolean) => void;
  onClose: () => void;
};

const FamilySidebar = ({
  family,
  isOpen,
  onClose,
  onEditEnrolment,
  onSaveFamily,
}: Props) => {
  const { currentUser, users } = useContext(UsersContext);
  const classes = useStyles();
  const sidebar = useRef<HTMLDivElement>(null);

  const [familyFormData, setFamilyFormData] = useState<FamilyFormData>(
    familyResponseToFamilyFormData(family)
  );
  const [isEditingFamily, setIsEditingFamily] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isEditing =
    isEditingFamily ||
    familyFormData.interactions.some((interaction) => interaction.isEditing);

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
      setIsEditingFamily(false);
      return () => {
        document.removeEventListener("mousedown", handleClick);
      };
    }
    return () => {};
  }, [isOpen]);

  const saveFamily = async (
    data: FamilyFormData,
    refetch: boolean
  ): Promise<boolean> => {
    try {
      const res = await FamilyAPI.putFamily({
        ...familyFormDataToFamilyRequest(data),
        id: family.id,
      });
      onSaveFamily(res, refetch);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err);
      return false;
    }
    return true;
  };

  // Enrolments ===============================================================

  const activeEnrolments = family.enrolments.filter(
    (enrolment) => enrolment.session.active && !enrolment.is_guest
  );

  const previousEnrolments = family.enrolments.filter(
    (enrolment) => !activeEnrolments.includes(enrolment)
  );

  // Family form ==============================================================

  const resetFormData = () => {
    setFamilyFormData(familyResponseToFamilyFormData(family));
  };

  useEffect(() => {
    resetFormData();
  }, [family]);

  const onToggleEdit = (editing: boolean) => {
    if (isEditingFamily) {
      resetFormData();
    }
    setIsEditingFamily(editing);
  };

  const onSubmitFamilyForm = async () => {
    setIsLoading(true);
    const success = await saveFamily(familyFormData, true);
    if (success) {
      setIsEditingFamily(false);
    }
    setIsLoading(false);
  };

  // Interactions =============================================================

  const addInteraction = () => {
    setFamilyFormData({
      ...familyFormData,
      interactions: [
        ...familyFormData.interactions,
        {
          date: moment().format("YYYY-MM-DD"),
          index: generateInteractionsKey(),
          isEditing: true,
          type: "",
          user_id: currentUser ? currentUser.id : users[0].id,
        },
      ],
    });
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
      onClose={() => {
        onToggleEdit(false);
        onClose();
      }}
      PaperProps={{ ref: sidebar }}
    >
      {isLoading && <SpinnerOverlay />}

      <Box padding={3} paddingBottom={isEditingFamily ? 10 : 3}>
        <Typography component="h2" variant="h3">
          {family.parent.first_name} {family.parent.last_name}
        </Typography>

        <Typography variant="h3" className={classes.heading}>
          Enrolment
        </Typography>
        {activeEnrolments.length ? (
          activeEnrolments.map((enrolment, i) => (
            <div key={enrolment.id}>
              <EnrolmentForm enrolment={enrolment} onChange={onEditEnrolment} />
              {i < activeEnrolments.length - 1 && (
                <Box paddingY={2}>
                  <Divider />
                </Box>
              )}
            </div>
          ))
        ) : (
          <EnrolmentForm enrolment={null} />
        )}

        <Box paddingTop={2}>
          <Divider />
        </Box>

        <Box position="relative">
          <Box position="absolute" top={8} right={0}>
            <IconButton
              className={classes.actionButton}
              disabled={isEditing}
              onClick={() => onToggleEdit(!isEditingFamily)}
            >
              <Edit />
            </IconButton>
          </Box>
          <Box>
            <FamilySidebarForm
              family={familyFormData}
              isEditing={isEditingFamily}
              onChange={setFamilyFormData}
              onSubmit={onSubmitFamilyForm}
            />
          </Box>
        </Box>

        <Box paddingTop={2}>
          <Divider />
        </Box>

        <Typography variant="h3" className={classes.heading}>
          Notes
        </Typography>
        {isEditingFamily ? (
          <InputBase
            className={classes.notes}
            disabled={!isEditingFamily}
            fullWidth
            inputProps={{ "aria-label": "notes" }}
            multiline
            onChange={(e) => {
              setFamilyFormData({
                ...familyFormData,
                notes: e.target.value,
              });
            }}
            value={familyFormData.notes}
          />
        ) : (
          <Typography variant="body2" className={classes.notesViewOnly}>
            {familyFormData.notes}
          </Typography>
        )}

        <Box paddingTop={2}>
          <Divider />
        </Box>

        <Box position="relative">
          <Box position="absolute" top={8} right={0}>
            <IconButton
              className={classes.actionButton}
              disabled={isEditing}
              onClick={addInteraction}
            >
              <Add />
            </IconButton>
          </Box>
          <Box>
            <Typography variant="h3" className={classes.heading}>
              Recent interactions
            </Typography>
            {familyFormData.interactions.length > 0 ? (
              familyFormData.interactions
                // sort with most recent interaction first
                .sort((a, b) => moment(b.date).diff(moment(a.date), "days"))
                .map((interaction, index) => (
                  <InteractionCard
                    key={interaction.index}
                    disabled={isEditing}
                    interaction={interaction}
                    onDelete={async () => {
                      saveFamily(
                        {
                          ...familyFormData,
                          interactions: familyFormData.interactions.filter(
                            (value) => value.index !== interaction.index
                          ),
                        },
                        false
                      );
                    }}
                    onSubmit={async (data) => {
                      const interactions = [...familyFormData.interactions];
                      interactions[index] = data;
                      saveFamily(
                        {
                          ...familyFormData,
                          interactions,
                        },
                        false
                      );
                    }}
                    onToggleEdit={() => {
                      const interactions = [...familyFormData.interactions];
                      interactions[index].isEditing = true;
                      setFamilyFormData({ ...familyFormData, interactions });
                    }}
                    users={users}
                  />
                ))
            ) : (
              <Box paddingBottom={1}>
                <Typography variant="body2">No recent interactions</Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Box paddingTop={2}>
          <Divider />
        </Box>

        <Typography variant="h3" className={classes.heading}>
          Previous Enrolments
        </Typography>
        {previousEnrolments.length ? (
          previousEnrolments.map((enrolment) => (
            <PreviousEnrolmentCard
              key={enrolment.id}
              enrolment={enrolment}
              students={family.children
                .concat(family.parent)
                .concat(family.guests)}
            />
          ))
        ) : (
          <Box paddingLeft={2}>
            <Typography variant="body2">No previous enrolments</Typography>
          </Box>
        )}
      </Box>

      {isEditingFamily && (
        <Box
          alignContent="end"
          bottom={0}
          className={classes.formActionRow}
          display="flex"
          justifyContent="flex-end"
          paddingY={2}
          position="fixed"
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
