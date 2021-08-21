import React, { useState } from "react";

import {
  Box,
  Card,
  Checkbox,
  IconButton,
  MenuItem,
  OutlinedInput,
  Radio,
  Select,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  Clear,
  DragIndicator,
  EditOutlined,
  LockOutlined,
} from "@material-ui/icons";

import FormActionIconButtons from "components/common/form-action-icon-buttons";
import FormRow from "components/common/form-row";
import FieldVariant from "constants/FieldVariant";
import QuestionType from "constants/QuestionType";
import { DefaultField, DynamicField } from "types";

import QuestionTypeLabel from "../question-type-label";
import useStyles from "./styles";

type Props = {
  field: DefaultField | DynamicField;
  isDefault: boolean;
  isEnabled?: boolean;
  isReadOnly: boolean;
  onChangeEnabled?: (enabled: boolean) => void;
  onDeleteField?: () => void;
  onUpdateField?: () => void;
};

const FieldEditor = ({
  field,
  isDefault,
  isEnabled = true,
  isReadOnly,
  onChangeEnabled = () => {},
  onDeleteField = () => {},
  onUpdateField = () => {},
}: Props) => {
  const classes = useStyles({ isDefault });
  const [isEditing, setIsEditing] = useState(false);
  const [fieldFormData, setFieldFormData] = useState({ ...field });

  return (
    <Card className={classes.card} elevation={2}>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" flexGrow={1}>
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
          {!isEditing ? (
            <Typography variant="body2" className={classes.label}>
              {field.name}
            </Typography>
          ) : (
            <FormRow
              id={`${field.id} name`}
              label={`${fieldFormData.name} field name`}
              multiple={false}
              questionType={QuestionType.TEXT}
              variant={FieldVariant.COMPACT}
            >
              <OutlinedInput
                autoComplete="new-password" // disable autocomplete
                className={classes.input}
                fullWidth
                id={`${field.id} name`}
                onChange={(e) =>
                  setFieldFormData({ ...fieldFormData, name: e.target.value })
                }
                value={fieldFormData.name}
              />
            </FormRow>
          )}
        </Box>
        <Box display="flex">
          <Box display="flex" paddingX={2}>
            {isDefault ? (
              <Box display="flex" marginRight={6}>
                <LockOutlined className={classes.labelIcon} />
                <Typography
                  color="textSecondary"
                  variant="body2"
                  style={{ fontSize: 12, alignSelf: "center", marginRight: 8 }}
                >
                  Identifier
                </Typography>
              </Box>
            ) : (
              <>
                {!isEditing ? (
                  <QuestionTypeLabel questionType={field.question_type} />
                ) : (
                  <FormRow
                    id={`${field.id} question type`}
                    label={`${field.name} field question type`}
                    multiple={false}
                    questionType={QuestionType.TEXT}
                    variant={FieldVariant.COMPACT}
                  >
                    <Select
                      aria-label={field.question_type}
                      className={classes.input}
                      displayEmpty
                      fullWidth
                      inputProps={{
                        className: classes.select,
                      }}
                      labelId={`${field.id} question type`}
                      onChange={(e) =>
                        setFieldFormData({
                          ...fieldFormData,
                          question_type: e.target.value as string,
                        })
                      }
                      value={fieldFormData.question_type}
                      variant="outlined"
                    >
                      <MenuItem
                        value={QuestionType.TEXT}
                        className={classes.menuItem}
                      >
                        <QuestionTypeLabel questionType={QuestionType.TEXT} />
                      </MenuItem>
                      <MenuItem
                        value={QuestionType.SELECT}
                        className={classes.menuItem}
                      >
                        <QuestionTypeLabel questionType={QuestionType.SELECT} />
                      </MenuItem>
                      <MenuItem
                        value={QuestionType.MULTIPLE_SELECT}
                        className={classes.menuItem}
                      >
                        <QuestionTypeLabel
                          questionType={QuestionType.MULTIPLE_SELECT}
                        />
                      </MenuItem>
                    </Select>
                  </FormRow>
                )}
              </>
            )}
          </Box>
          {!isReadOnly && (
            <Box justifyContent="right">
              {!isDefault &&
                (!isEditing ? (
                  <IconButton
                    size="small"
                    className={classes.editButton}
                    onClick={() => {
                      setIsEditing(true);
                    }}
                  >
                    <EditOutlined />
                  </IconButton>
                ) : (
                  <FormActionIconButtons
                    onDelete={onDeleteField}
                    onSubmit={onUpdateField}
                  />
                ))}
            </Box>
          )}
        </Box>
      </Box>
      {isEditing && field.question_type !== QuestionType.TEXT && (
        <Box display="flex" flexDirection="column" paddingLeft={1.5}>
          {fieldFormData.options.map((option) => (
            <Box>
              {field.question_type === QuestionType.MULTIPLE_SELECT ? (
                <Checkbox disabled />
              ) : (
                <Radio disabled />
              )}
              <TextField key={option} value={option} size="small" />
              <IconButton size="small">
                <Clear />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Card>
  );
};

export default FieldEditor;
