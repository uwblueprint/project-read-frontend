import React, { ReactNode } from "react";

import { Box, Card, IconButton, Switch, Typography } from "@material-ui/core";
import {
  CheckBox,
  DragIndicator,
  EditOutlined,
  ExpandMore,
  LockOutlined,
  ShortText,
} from "@material-ui/icons";

import QuestionType from "constants/QuestionType";
import { DefaultField, DynamicField } from "types";

import useStyles from "./styles";

type QuestionTypeDisplay = {
  icon: ReactNode;
  label: string;
};

const getQuestionTypeDisplay = (
  type: string,
  className: string
): QuestionTypeDisplay => {
  switch (type) {
    case QuestionType.SELECT:
      return {
        icon: <ExpandMore className={className} />,
        label: "Dropdown",
      };
    case QuestionType.MULTIPLE_SELECT:
      return {
        icon: <CheckBox className={className} />,
        label: "Checkboxes",
      };
    case QuestionType.TEXT:
      return {
        icon: <ShortText className={className} />,
        label: "Short answer",
      };
    default:
      return {
        icon: null,
        label: "",
      };
  }
};

type Props = {
  field: DefaultField | DynamicField;
  isDefault: boolean;
  isEnabled?: boolean;
  isReadOnly: boolean;
  onChangeEnabled?: (enabled: boolean) => void;
};

const FieldEditor = ({
  field,
  isDefault,
  isEnabled = true,
  isReadOnly,
  onChangeEnabled = () => {},
}: Props) => {
  const classes = useStyles({ isDefault });
  return (
    <Card className={classes.card} elevation={2}>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex">
          <DragIndicator
            color={isDefault ? "disabled" : "action"}
            className={classes.dragIcon}
          />
          {isReadOnly && (
            <Switch
              size="small"
              color="primary"
              checked={isDefault || isEnabled}
              disabled={isDefault}
              onChange={(e, checked) => {
                onChangeEnabled(checked);
              }}
            />
          )}
          <Typography variant="body2" className={classes.label}>
            {field.name}
          </Typography>
        </Box>
        <Box display="flex">
          <Box display="flex">
            {isDefault ? (
              <LockOutlined className={classes.labelIcon} />
            ) : (
              getQuestionTypeDisplay(field.question_type, classes.labelIcon)
                .icon
            )}
            <Typography
              color="textSecondary"
              variant="body2"
              style={{ fontSize: 12, alignSelf: "center", marginRight: 8 }}
            >
              {isDefault
                ? "Identifier"
                : getQuestionTypeDisplay(field.question_type, classes.labelIcon)
                    .label}
            </Typography>
          </Box>
          {!isReadOnly && (
            <Box width={24} marginLeft={3} justifyContent="right">
              {!isDefault && (
                <IconButton size="small" className={classes.editButton}>
                  <EditOutlined />
                </IconButton>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default FieldEditor;
