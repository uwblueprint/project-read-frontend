import React, { useContext, useEffect, useState } from "react";

import {
  Box,
  Card,
  Checkbox,
  IconButton,
  Input,
  InputBase,
  MenuItem,
  OutlinedInput,
  Radio,
  Select,
  Switch,
  Typography,
} from "@material-ui/core";
import { Clear, DragIndicator, EditOutlined } from "@material-ui/icons";

import DynamicFieldAPI from "api/DynamicFieldAPI";
import ConfirmationDialog from "components/common/confirmation-dialog";
import FormActionIconButtons from "components/common/form-action-icon-buttons";
import FormRow from "components/common/form-row";
import FieldVariant from "constants/FieldVariant";
import QuestionType from "constants/QuestionType";
import { DynamicFieldsContext } from "context/DynamicFieldsContext";
import { DefaultField, DynamicField } from "types";

import QuestionTypeLabel from "../question-type-label";
import useStyles from "./styles";

// unique identifier for options
let OPTION_KEY_COUNTER = 1;

const generateKey = (): number => {
  const key = OPTION_KEY_COUNTER;
  OPTION_KEY_COUNTER += 1;
  return key;
};

const getSelectIndicator = (className: string, questionType: string) =>
  questionType === QuestionType.MULTIPLE_SELECT ? (
    <Checkbox className={className} disabled size="small" />
  ) : (
    <Radio className={className} disabled size="small" />
  );

type OptionFormData = {
  index: number;
  value: string;
};

type FieldFormData = Omit<DefaultField | DynamicField, "options"> & {
  options: OptionFormData[];
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
  const { fetchDynamicFields } = useContext(DynamicFieldsContext);
  const classes = useStyles({ isDefault });
  const [isEditing, setIsEditing] = useState(false);
  const [fieldFormData, setFieldFormData] = useState<FieldFormData>({
    ...field,
    options: [],
  });
  const [showEditConfirmationDialog, setShowEditConfirmationDialog] = useState(
    false
  );
  const [
    showDeleteConfirmationDialog,
    setShowDeleteConfirmationDialog,
  ] = useState(false);

  useEffect(() => {
    setFieldFormData({
      ...field,
      options: field.options.map((option) => ({
        index: generateKey(),
        value: option,
      })),
    });
  }, [field]);

  const onAddOption = (): void => {
    setFieldFormData({
      ...fieldFormData,
      options: [...fieldFormData.options, { index: generateKey(), value: "" }],
    });
  };

  const onUpdateOption = (data: OptionFormData): void => {
    const options = [...fieldFormData.options];
    const optionIndex = options.findIndex(
      (option) => option.index === data.index
    );
    options[optionIndex] = data;
    setFieldFormData({ ...fieldFormData, options });
  };

  const onDeleteOption = (index: number): void => {
    setFieldFormData({
      ...fieldFormData,
      options: fieldFormData.options.filter((option) => option.index !== index),
    });
  };

  const onSubmitField = async () => {
    const data = {
      ...fieldFormData,
      id: Number(field.id),
      options: fieldFormData.options.map((option) => option.value),
    };
    try {
      await DynamicFieldAPI.putField(data);
      setIsEditing(false);
      fetchDynamicFields();
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err);
    }
  };

  const onDeleteField = async () => {
    try {
      // TODO: call delete endpoint
      fetchDynamicFields();
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err);
    }
  };

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
            {isEditing ? (
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
            ) : (
              <Typography variant="body2" className={classes.label}>
                {field.name}
              </Typography>
            )}
          </Box>
          <Box display="flex" alignItems="center">
            <Box
              display="flex"
              justifyContent="flex-end"
              paddingX={2}
              width={160}
            >
              {isDefault ? (
                <Box marginRight={isReadOnly ? 0 : 6}>
                  <QuestionTypeLabel questionType={QuestionType.IDENTIFIER} />
                </Box>
              ) : (
                <>
                  {isEditing ? (
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
                        <MenuItem value={QuestionType.TEXT}>
                          <QuestionTypeLabel questionType={QuestionType.TEXT} />
                        </MenuItem>
                        <MenuItem value={QuestionType.SELECT}>
                          <QuestionTypeLabel
                            questionType={QuestionType.SELECT}
                          />
                        </MenuItem>
                        <MenuItem value={QuestionType.MULTIPLE_SELECT}>
                          <QuestionTypeLabel
                            questionType={QuestionType.MULTIPLE_SELECT}
                          />
                        </MenuItem>
                      </Select>
                    </FormRow>
                  ) : (
                    <QuestionTypeLabel questionType={field.question_type} />
                  )}
                </>
              )}
            </Box>
            {!isReadOnly && (
              <Box justifyContent="right">
                {!isDefault &&
                  (isEditing ? (
                    <FormActionIconButtons
                      onDelete={() => setShowDeleteConfirmationDialog(true)}
                      onSubmit={() => onSubmitField()}
                    />
                  ) : (
                    <IconButton
                      aria-label="edit question"
                      className={classes.editButton}
                      onClick={() => setShowEditConfirmationDialog(true)}
                      size="small"
                    >
                      <EditOutlined />
                    </IconButton>
                  ))}
              </Box>
            )}
          </Box>
        </Box>
        {isEditing && fieldFormData.question_type !== QuestionType.TEXT && (
          <Box marginTop={1} paddingLeft={1.5} width={435}>
            {fieldFormData.options.map((option, i) => (
              <Box key={option.index} display="flex" alignItems="center">
                {getSelectIndicator(
                  classes.selectIndicator,
                  fieldFormData.question_type
                )}
                <FormRow
                  dense
                  id={`${field.id} option ${i}`}
                  label={`Option ${i}`}
                  questionType={QuestionType.TEXT}
                  variant={FieldVariant.COMPACT}
                >
                  <Input
                    autoFocus={i === fieldFormData.options.length - 1}
                    className={classes.input}
                    fullWidth
                    id={`${field.id} option ${i}`}
                    onChange={(e) =>
                      onUpdateOption({
                        index: option.index,
                        value: e.target.value,
                      })
                    }
                    value={option.value}
                  />
                </FormRow>
                <IconButton
                  aria-label="Delete option"
                  onClick={() => onDeleteOption(option.index)}
                  size="small"
                >
                  <Clear fontSize="small" />
                </IconButton>
              </Box>
            ))}
            <Box display="flex" alignItems="center">
              {getSelectIndicator(
                classes.selectIndicator,
                fieldFormData.question_type
              )}
              <InputBase
                className={classes.input}
                inputProps={{ "aria-label": "new option" }}
                onChange={onAddOption}
                onClick={onAddOption}
                placeholder="New option"
                value=""
              />
            </Box>
          </Box>
        )}
      </Card>
    </>
  );
};

export default FieldEditor;
