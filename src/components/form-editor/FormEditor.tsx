import React, { useContext, useState } from "react";

import { Box, Typography } from "@material-ui/core";

import DefaultFields from "constants/DefaultFields";
import StudentRole from "constants/StudentRole";
import { DynamicFieldsContext } from "context/DynamicFieldsContext";

import { DEFAULT_FAMILY_FIELDS, DEFAULT_STUDENT_FIELDS } from "./constants";
import FieldEditor from "./field-editor";
import NewFieldEditor, {
  NewDynamicField,
} from "./new-field-editor/NewFieldEditor";
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
  } = useContext(DynamicFieldsContext).dynamicFields;
  const classes = useStyles();

  const [newParentField, setNewParentField] = useState<NewDynamicField | null>(
    null
  );
  const [newChildField, setNewChildField] = useState<NewDynamicField | null>(
    null
  );
  const [newGuestField, setNewGuestField] = useState<NewDynamicField | null>(
    null
  );
  const [
    newSessionField,
    setNewSessionField,
  ] = useState<NewDynamicField | null>(null);

  const handleChangeEnabledField = (id: number, enabled: boolean) =>
    enabled
      ? onChangeEnabledFieldIds([...enabledFieldIds, id])
      : onChangeEnabledFieldIds(enabledFieldIds.filter((val) => val !== id));

  return (
    <Box width={800} marginX="auto">
      <Typography component="h2" variant="h3" className={classes.heading}>
        Basic information
      </Typography>
      {DEFAULT_STUDENT_FIELDS.concat(DEFAULT_FAMILY_FIELDS).map((field) => (
        <FieldEditor
          key={field.id}
          field={field}
          isReadOnly={isReadOnly}
          role={StudentRole.PARENT}
        />
      ))}
      {parentDynamicFields.map((field) => (
        <FieldEditor
          key={field.id}
          existingFieldId={field.id}
          field={field}
          isEnabled={enabledFieldIds.includes(field.id)}
          isReadOnly={isReadOnly}
          onChangeEnabled={(enabled) =>
            handleChangeEnabledField(field.id, enabled)
          }
          role={StudentRole.PARENT}
        />
      ))}
      {!isReadOnly && (
        <NewFieldEditor
          existingFields={parentDynamicFields}
          newField={newParentField}
          onAdd={(data) => setNewParentField(data)}
          onSubmit={() => setNewParentField(null)}
          role={StudentRole.PARENT}
        />
      )}

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
          isReadOnly={isReadOnly}
          role={StudentRole.CHILD}
        />
      ))}
      {childDynamicFields.map((field) => (
        <FieldEditor
          key={field.id}
          existingFieldId={field.id}
          field={field}
          isEnabled={enabledFieldIds.includes(field.id)}
          isReadOnly={isReadOnly}
          onChangeEnabled={(enabled) =>
            handleChangeEnabledField(field.id, enabled)
          }
          role={StudentRole.CHILD}
        />
      ))}
      {!isReadOnly && (
        <NewFieldEditor
          existingFields={childDynamicFields}
          newField={newChildField}
          onAdd={(data) => setNewChildField(data)}
          onSubmit={() => setNewChildField(null)}
          role={StudentRole.CHILD}
        />
      )}

      <Typography component="h3" variant="h4" className={classes.subHeading}>
        Additional members
      </Typography>
      {DEFAULT_STUDENT_FIELDS.map((field) => (
        <FieldEditor
          key={field.id}
          field={field}
          isReadOnly={isReadOnly}
          role={StudentRole.GUEST}
        />
      ))}
      {guestDynamicFields.map((field) => (
        <FieldEditor
          key={field.id}
          existingFieldId={field.id}
          field={field}
          isEnabled={enabledFieldIds.includes(field.id)}
          isReadOnly={isReadOnly}
          onChangeEnabled={(enabled) =>
            handleChangeEnabledField(field.id, enabled)
          }
          role={StudentRole.GUEST}
        />
      ))}
      {!isReadOnly && (
        <NewFieldEditor
          existingFields={guestDynamicFields}
          newField={newGuestField}
          onAdd={(data) => setNewGuestField(data)}
          onSubmit={() => setNewGuestField(null)}
          role={StudentRole.GUEST}
        />
      )}

      <Typography component="h2" variant="h3" className={classes.heading}>
        Session questions
      </Typography>
      <FieldEditor
        field={DefaultFields.PREFERRED_CLASS}
        isReadOnly={isReadOnly}
        role={StudentRole.SESSION}
      />
      {sessionDynamicFields.map((field) => (
        <FieldEditor
          key={field.id}
          existingFieldId={field.id}
          field={field}
          isEnabled={enabledFieldIds.includes(field.id)}
          isReadOnly={isReadOnly}
          onChangeEnabled={(enabled) =>
            handleChangeEnabledField(field.id, enabled)
          }
          role={StudentRole.SESSION}
        />
      ))}
      {!isReadOnly && (
        <NewFieldEditor
          existingFields={sessionDynamicFields}
          newField={newSessionField}
          onAdd={(data) => setNewSessionField(data)}
          onSubmit={() => setNewSessionField(null)}
          role={StudentRole.SESSION}
        />
      )}
    </Box>
  );
};

export default FormEditor;
