import React, { useContext, useState } from "react";

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
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Clear, DragIndicator, EditOutlined } from "@material-ui/icons";

import DynamicFieldAPI from "api/DynamicFieldAPI";
import ConfirmationDialog from "components/common/confirmation-dialog";
import FormActionIconButtons from "components/common/form-action-icon-buttons";
import FormRow from "components/common/form-row";
import FieldVariant from "constants/FieldVariant";
import QuestionType from "constants/QuestionType";
import StudentRole from "constants/StudentRole";
import { DynamicFieldsContext } from "context/DynamicFieldsContext";
import { DefaultField, DynamicField, FieldType } from "types";

import QuestionTypeLabel from "../question-type-label";
import useStyles from "./styles";

const DELETE_OPTION_MESSAGE =
  "Dropdown or checkbox questions must have at least one option";

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

export type FieldFormData = (
  | Omit<DefaultField, "options">
  | Omit<DynamicField, "id" | "options">
) & {
  options: OptionFormData[];
};

type Props = {
  existingFieldId?: number | null;
  field: DefaultField | Omit<DynamicField, "id">;
  isEnabled?: boolean;
  isReadOnly: boolean;
  onChangeEnabled?: (enabled: boolean) => void;
  onSubmit?: () => void;
  role: StudentRole;
};

const FieldEditor = ({
  existingFieldId = null,
  field,
  isEnabled = true,
  isReadOnly,
  onChangeEnabled = () => {},
  onSubmit = () => {},
}: Props) => {
  const { fetchDynamicFields } = useContext(DynamicFieldsContext);
  const isDefault = field.type === FieldType.Default;
  const classes = useStyles({ isDefault });
  const [isEditing, setIsEditing] = useState(
    !isDefault && existingFieldId === null
  );
  const [fieldFormData, setFieldFormData] = useState<FieldFormData>({
    ...field,
    options: field.options.map((option) => ({
      index: generateKey(),
      value: option,
    })),
  });
  const [showEditConfirmationDialog, setShowEditConfirmationDialog] = useState(
    false
  );
  const [
    showDeleteConfirmationDialog,
    setShowDeleteConfirmationDialog,
  ] = useState(false);

  const getId = () => {
    if (field.type === FieldType.Default) {
      return field.id;
    }
    if (existingFieldId) {
      return existingFieldId;
    }
    return `new ${field.role} field`;
  };

  const onAddOption = (): void => {
    setFieldFormData({
      ...fieldFormData,
      options: [
        ...fieldFormData.options,
        {
          index: generateKey(),
          value: `Option ${fieldFormData.options.length + 1}`,
        },
      ],
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

  const deleteOptionDisabled = fieldFormData.options.length <= 1;

  const onDeleteOption = (index: number): void => {
    setFieldFormData({
      ...fieldFormData,
      options: fieldFormData.options.filter((option) => option.index !== index),
    });
  };

  const formErrorMessage =
    fieldFormData.name.length === 0 ? "Please enter a question name" : "";

  const onSubmitField = async () => {
    if (field.type === FieldType.Default) {
      return;
    }

    let options: string[] = [];
    if (fieldFormData.question_type !== QuestionType.TEXT) {
      options = fieldFormData.options.map((option) => option.value);
    }
    try {
      if (existingFieldId !== null) {
        await DynamicFieldAPI.putField({
          ...fieldFormData,
          id: existingFieldId,
          options,
          order: field.order,
          role: field.role,
        });
      } else {
        await DynamicFieldAPI.postField({
          ...fieldFormData,
          options,
          order: field.order,
          role: field.role,
        });
      }
      setIsEditing(false);
      fetchDynamicFields();
      onSubmit();
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
                id={`${getId()} name`}
                label={`${getId()} name`}
                multiple={false}
                questionType={QuestionType.TEXT}
                variant={FieldVariant.COMPACT}
              >
                <OutlinedInput
                  autoComplete="new-password" // disable autocomplete
                  className={classes.input}
                  fullWidth
                  id={`${getId()} name`}
                  inputProps={{ maxLength: 512 }}
                  onChange={(e) =>
                    setFieldFormData({ ...fieldFormData, name: e.target.value })
                  }
                  placeholder="Question name"
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
                      id={`${getId()} question type`}
                      label={`${getId()} question type`}
                      multiple={false}
                      questionType={QuestionType.TEXT}
                      variant={FieldVariant.COMPACT}
                    >
                      <Select
                        aria-label={`${getId()} question type`}
                        className={classes.input}
                        displayEmpty
                        fullWidth
                        labelId={`${getId()} question type`}
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
                      errorMessage={formErrorMessage}
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
                  id={`${getId()} option ${i}`}
                  label={`Option ${i}`}
                  questionType={QuestionType.TEXT}
                  variant={FieldVariant.COMPACT}
                >
                  <Input
                    autoFocus={i === fieldFormData.options.length - 1}
                    className={classes.input}
                    fullWidth
                    id={`${getId()} option ${i}`}
                    inputProps={{ maxLength: 64 }}
                    onChange={(e) =>
                      onUpdateOption({
                        index: option.index,
                        value: e.target.value,
                      })
                    }
                    placeholder="Option name"
                    value={option.value}
                  />
                </FormRow>
                <Tooltip
                  aria-label={deleteOptionDisabled ? DELETE_OPTION_MESSAGE : ""}
                  title={deleteOptionDisabled ? DELETE_OPTION_MESSAGE : ""}
                >
                  <span>
                    <IconButton
                      aria-label="Delete option"
                      disabled={deleteOptionDisabled}
                      onClick={() => onDeleteOption(option.index)}
                      size="small"
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
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
