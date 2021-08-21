import React, { useContext } from "react";

import { Box, Typography } from "@material-ui/core";

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
