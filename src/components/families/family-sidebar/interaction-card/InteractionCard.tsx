import React, { useState } from "react";

import {
  Box,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@material-ui/core";
import { Check, DeleteOutline, Edit } from "@material-ui/icons";
import moment from "moment";

import { UserResponse } from "api/types";
import DateInput from "components/common/date-input";
import FormRow from "components/common/form-row";
import { InteractionFormData } from "components/families/family-form/types";
import FieldVariant from "constants/FieldVariant";
import QuestionType from "constants/QuestionType";

import SidebarCard from "../sidebar-card";
import useStyles from "./styles";

type Props = {
  disabled: boolean;
  interaction: InteractionFormData;
  onDelete: () => void;
  onSubmit: (data: InteractionFormData) => void;
  onToggleEdit: () => void;
  users: UserResponse[];
};

const InteractionCard = ({
  disabled,
  interaction,
  onDelete,
  onSubmit,
  onToggleEdit,
  users,
}: Props) => {
  const classes = useStyles();
  const [
    interactionFormData,
    setInteractionFormData,
  ] = useState<InteractionFormData>({
    ...interaction,
  });

  const id = `interaction ${interaction.index}`;

  if (!interaction.isEditing) {
    const user = users.find((val) => val.id === interaction.user_id);
    return (
      <SidebarCard>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="body2" className={classes.title}>
              {interaction.type.length
                ? interaction.type
                : "Untitled interaction"}
            </Typography>
            <Typography variant="body2" className={classes.content}>
              {user?.first_name} {user?.last_name.charAt(0)}. -{" "}
              {moment(interaction.date, "YYYY-MM-DD").format("MMM. D, YYYY")}
            </Typography>
          </Box>
          <Box>
            <IconButton
              className={classes.editButton}
              disabled={disabled}
              onClick={onToggleEdit}
            >
              <Edit />
            </IconButton>
          </Box>
        </Box>
      </SidebarCard>
    );
  }

  return (
    <SidebarCard>
      <Box display="flex">
        <Box flexGrow={1} marginRight={1}>
          <FormRow
            dense
            id={`${id} type`}
            label={`${id} type`}
            questionType={QuestionType.TEXT}
            variant={FieldVariant.COMPACT}
          >
            <OutlinedInput
              className={classes.input}
              fullWidth
              id={`${id} type`}
              onChange={(e) =>
                setInteractionFormData({
                  ...interactionFormData,
                  type: e.target.value,
                })
              }
              placeholder="Interaction title"
              value={interactionFormData.type}
            />
          </FormRow>
        </Box>
        <Box>
          <IconButton className={classes.formActionButton} onClick={onDelete}>
            <DeleteOutline />
          </IconButton>
          <IconButton
            className={classes.formActionButton}
            onClick={() =>
              onSubmit({ ...interactionFormData, isEditing: false })
            }
          >
            <Check />
          </IconButton>
        </Box>
      </Box>
      <Box display="flex">
        <Box width={188} marginRight={0.5}>
          <FormRow
            dense
            id={`${id} contacted by`}
            label={`${id} contacted by`}
            questionType={QuestionType.MULTIPLE_CHOICE}
            variant={FieldVariant.COMPACT}
          >
            <Select
              aria-label="contacted by"
              className={classes.input}
              displayEmpty
              fullWidth
              inputProps={{ className: classes.select }}
              labelId={`${id} contacted by`}
              onChange={(e) =>
                setInteractionFormData({
                  ...interactionFormData,
                  user_id: Number(e.target.value),
                })
              }
              value={interactionFormData.user_id.toString()}
              variant="outlined"
            >
              {users.map((user) => (
                <MenuItem
                  key={user.id}
                  value={user.id.toString()}
                  className={classes.menuItem}
                >
                  {user.first_name} {user.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormRow>
        </Box>
        <Box>
          <FormRow
            dense
            id={`${id} date`}
            label={`${id} date`}
            questionType={QuestionType.TEXT}
            variant={FieldVariant.COMPACT}
          >
            <DateInput
              dense
              disableFuture
              id={`${id} date`}
              onChange={(date) => {
                setInteractionFormData({
                  ...interactionFormData,
                  date: moment(date).format("YYYY-MM-DD"),
                });
              }}
              value={moment(interactionFormData.date, "YYYY-MM-DD").toDate()}
            />
          </FormRow>
        </Box>
      </Box>
    </SidebarCard>
  );
};

export default InteractionCard;
