import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

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

const DRAWER_WIDTH = 416;

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
    width: DRAWER_WIDTH,
  },
  drawerPaper: {
    backgroundColor: theme.palette.backgroundSecondary.paper,
    borderLeft: "none",
    height: "calc(100% - 64px)",
    marginTop: 64,
    width: DRAWER_WIDTH,
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
  onSaveFamily: (family: FamilyDetailResponse, refetch: boolean) => void;
  onClose: () => void;
};

const FamilySidebar = ({
  family,
  isOpen,
  onClose,
  onEditCurrentEnrolment,
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

  // Family form =============================================================

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

  // Notes ====================================================================

  const debouncedSaveFamily = useCallback(
    debounce((notes: string) => {
      saveFamily({ ...familyFormData, notes }, false);
    }, 1000),
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
      {isLoading && <SpinnerOverlay />}

      <Box padding={3} paddingBottom={isEditingFamily ? 10 : 3}>
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

        {!isEditingFamily && (
          <Box paddingTop={2}>
            <Divider />
          </Box>
        )}

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
              <Box paddingLeft={2} paddingBottom={1}>
                <Typography variant="body2">No recent interactions</Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Box paddingTop={2}>
          <Divider />
        </Box>

        <Typography variant="h3" className={classes.heading}>
          Notes
        </Typography>
        <InputBase
          className={classes.notes}
          defaultValue=""
          disabled={isEditing}
          fullWidth
          inputProps={{ "aria-label": "notes" }}
          multiline
          onChange={(e) => {
            const notes = e.target.value;
            setFamilyFormData({
              ...familyFormData,
              notes,
            });
            debouncedSaveFamily(notes);
          }}
          value={familyFormData.notes}
        />
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
          width={DRAWER_WIDTH}
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
