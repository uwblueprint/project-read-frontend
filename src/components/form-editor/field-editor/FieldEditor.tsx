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
  Typography,
} from "@material-ui/core";
import { DragIndicator, EditOutlined, LockOutlined } from "@material-ui/icons";

import ConfirmationDialog from "components/common/confirmation-dialog";
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
  const [showEditConfirmationDialog, setShowEditConfirmationDialog] = useState(
    false
  );
  const [
    showDeleteConfirmationDialog,
    setShowDeleteConfirmationDialog,
  ] = useState(false);

  return (
    <>
      <ConfirmationDialog
        cancelButtonLabel="No, go back"
        confirmButtonLabel="Yes"
        description="By editing this question, you will also be updating the question for existing clients."
        onCancel={() => setShowEditConfirmationDialog(false)}
        onConfirm={() => {
          setIsEditing(true);
          setShowEditConfirmationDialog(false);
        }}
        open={showEditConfirmationDialog}
        title="Are you sure you want to edit this question?"
      />
      <ConfirmationDialog
        cancelButtonLabel="No, go back"
        confirmButtonLabel="Yes"
        description="By deleting this question, you will also be deleting the question for existing clients."
        onCancel={() => setShowDeleteConfirmationDialog(false)}
        onConfirm={() => {
          onDeleteField();
          setShowDeleteConfirmationDialog(false);
        }}
        open={showDeleteConfirmationDialog}
        title="Are you sure you want to delete this question?"
      />
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
            <Box
              display="flex"
              justifyContent="flex-end"
              paddingX={2}
              width={160}
            >
              {isDefault ? (
                <Box display="flex" marginRight={6}>
                  <LockOutlined className={classes.labelIcon} />
                  <Typography
                    color="textSecondary"
                    variant="body2"
                    style={{
                      fontSize: 12,
                      alignSelf: "center",
                      marginRight: 8,
                    }}
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
                          <QuestionTypeLabel
                            questionType={QuestionType.SELECT}
                          />
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
                      onClick={() => setShowEditConfirmationDialog(true)}
                    >
                      <EditOutlined />
                    </IconButton>
                  ) : (
                    <FormActionIconButtons
                      onDelete={() => setShowDeleteConfirmationDialog(true)}
                      onSubmit={() => {
                        onUpdateField();
                        setIsEditing(false);
                      }}
                    />
                  ))}
              </Box>
            )}
          </Box>
        </Box>
        {isEditing && field.question_type !== QuestionType.TEXT && (
          <Box marginTop={1} paddingLeft={1.5}>
            {fieldFormData.options.map((option) => (
              <Box display="flex" alignItems="center">
                {field.question_type === QuestionType.MULTIPLE_SELECT ? (
                  <Checkbox
                    className={classes.selectIndicator}
                    disabled
                    size="small"
                  />
                ) : (
                  <Radio
                    className={classes.selectIndicator}
                    disabled
                    size="small"
                  />
                )}
                <Typography variant="body2">{option}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Card>
    </>
  );
};

export default FieldEditor;
