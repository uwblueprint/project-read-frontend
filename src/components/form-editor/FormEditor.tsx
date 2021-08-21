import React, { useContext, useState } from "react";

import { Box, Typography } from "@material-ui/core";

import ConfirmationDialog from "components/common/confirmation-dialog";
import DefaultFields from "constants/DefaultFields";
import { DynamicFieldsContext } from "context/DynamicFieldsContext";

import { DEFAULT_FAMILY_FIELDS, DEFAULT_STUDENT_FIELDS } from "./constants";
import FieldEditor from "./field-editor";
import useStyles from "./styles";

type Props = {
  enabledFieldIds?: number[];
  isReadOnly: boolean;
  onChangeEnabledFieldIds?: (ids: number[]) => void;
};

const FormEditor = ({
  enabledFieldIds = [] as number[],
  isReadOnly,
  onChangeEnabledFieldIds = () => {},
}: Props) => {
  const {
    parentDynamicFields,
    childDynamicFields,
    guestDynamicFields,
    sessionDynamicFields,
  } = useContext(DynamicFieldsContext);
  const classes = useStyles();
  const [
    showEditConfirmationDialog,
    //  setShowEditConfirmationDialog,
  ] = useState(false);
  const [
    showDeleteConfirmationDialog,
    // setShowDeleteConfirmationDialog,
  ] = useState(false);

  const handleChangeEnabledField = (id: number, enabled: boolean) =>
    enabled
      ? onChangeEnabledFieldIds([...enabledFieldIds, id])
      : onChangeEnabledFieldIds(enabledFieldIds.filter((val) => val !== id));

  return (
    <Box width={800} marginX="auto">
      <ConfirmationDialog
        description="By editing this question, you will also be updating the question for existing clients."
        onCancel={() => {}}
        onConfirm={() => {}}
        open={showEditConfirmationDialog}
        title="Are you sure you want to edit this question?"
      />
      <ConfirmationDialog
        description="By deleting this question, you will also be deleting the question for existing clients."
        onCancel={() => {}}
        onConfirm={() => {}}
        open={showDeleteConfirmationDialog}
        title="Are you sure you want to delete this question?"
      />
      <Typography component="h2" variant="h3" className={classes.heading}>
        Basic information
      </Typography>
      {DEFAULT_STUDENT_FIELDS.concat(DEFAULT_FAMILY_FIELDS).map((field) => (
        <FieldEditor
          key={field.id}
          field={field}
          isDefault
          isReadOnly={isReadOnly}
        />
      ))}
      {parentDynamicFields.map((field) => (
        <FieldEditor
          key={field.id}
          field={field}
          isDefault={false}
          isEnabled={enabledFieldIds.includes(field.id)}
          isReadOnly={isReadOnly}
          onChangeEnabled={(enabled) =>
            handleChangeEnabledField(field.id, enabled)
          }
        />
      ))}

      <Typography component="h2" variant="h3" className={classes.heading}>
        Family members
      </Typography>
      <Typography component="h3" variant="h4" className={classes.subHeading}>
        Children
      </Typography>
      {DEFAULT_STUDENT_FIELDS.map((field) => (
        <FieldEditor
          key={field.id}
          field={field}
          isDefault
          isReadOnly={isReadOnly}
        />
      ))}
      {childDynamicFields.map((field) => (
        <FieldEditor
          key={field.id}
          field={field}
          isDefault={false}
          isEnabled={enabledFieldIds.includes(field.id)}
          isReadOnly={isReadOnly}
          onChangeEnabled={(enabled) =>
            handleChangeEnabledField(field.id, enabled)
          }
        />
      ))}
      <Typography component="h3" variant="h4" className={classes.subHeading}>
        Additional members
      </Typography>
      {DEFAULT_STUDENT_FIELDS.map((field) => (
        <FieldEditor
          key={field.id}
          field={field}
          isDefault
          isReadOnly={isReadOnly}
        />
      ))}
      {guestDynamicFields.map((field) => (
        <FieldEditor
          key={field.id}
          field={field}
          isDefault={false}
          isEnabled={enabledFieldIds.includes(field.id)}
          isReadOnly={isReadOnly}
          onChangeEnabled={(enabled) =>
            handleChangeEnabledField(field.id, enabled)
          }
        />
      ))}

      <Typography component="h2" variant="h3" className={classes.heading}>
        Session questions
      </Typography>
      <FieldEditor
        field={DefaultFields.PREFERRED_CLASS}
        isDefault
        isReadOnly={isReadOnly}
      />
      {sessionDynamicFields.map((field) => (
        <FieldEditor
          key={field.id}
          field={field}
          isDefault={false}
          isEnabled={enabledFieldIds.includes(field.id)}
          isReadOnly={isReadOnly}
          onChangeEnabled={(enabled) =>
            handleChangeEnabledField(field.id, enabled)
          }
        />
      ))}
    </Box>
  );
};

export default FormEditor;
