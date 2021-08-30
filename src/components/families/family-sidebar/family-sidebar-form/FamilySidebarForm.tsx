import React, { useContext } from "react";

import { Box, Divider, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { FamilyRequest } from "api/types";
import FamilyParentFields from "components/families/family-form/family-parent-fields";
import StudentForm from "components/families/family-form/student-form";
import { FamilyFormData } from "components/families/family-form/types";
import { familyFormDataToFamilyRequest } from "components/families/family-form/utils";
import StudentRole from "constants/StudentRole";
import { DynamicFieldsContext } from "context/DynamicFieldsContext";

export const familySidebarFormId = "familySidebarForm";

const useStyles = makeStyles(() => ({
  heading: {
    paddingBottom: 20,
    paddingTop: 20,
    fontSize: 18,
  },
}));

type Props = {
  family: FamilyFormData;
  isEditing: boolean;
  onOpen: (isOpen: boolean) => void;
  onChange: (family: FamilyFormData) => void;
  onSubmit: (family: FamilyRequest) => void;
};

const FamilySidebarForm = ({
  family,
  isEditing,
  onOpen,
  onChange,
  onSubmit,
}: Props) => {
  const classes = useStyles();
  const {
    childDynamicFields,
    guestDynamicFields,
    parentDynamicFields,
    sessionDynamicFields,
  } = useContext(DynamicFieldsContext).dynamicFields;

  const onSubmitFamilyForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(familyFormDataToFamilyRequest(family));
  };

  return (
    <form id={familySidebarFormId} onSubmit={onSubmitFamilyForm}>
      <Typography variant="h3" className={classes.heading}>
        Basic information
      </Typography>
      <Box marginBottom={2}>
        <FamilyParentFields
          dense
          dynamicFields={[...parentDynamicFields, ...sessionDynamicFields]}
          isEditing={isEditing}
          family={family}
          onChange={(value) => onChange({ ...family, ...value })}
        />
      </Box>
      {/* TODO: add session questions here */}
      <Divider />
      <Typography variant="h3" className={classes.heading}>
        Family members
      </Typography>
      {(family.children.length || isEditing) && (
        <StudentForm
          dense
          dynamicFields={childDynamicFields}
          isEditing={isEditing}
          onChange={(children) => onChange({ ...family, children })}
          onOpen={onOpen}
          role={StudentRole.CHILD}
          students={family.children}
        />
      )}
      {family.guests.length > 0 && !isEditing && (
        <Box paddingY={2}>
          <Divider />
        </Box>
      )}
      {(family.guests.length > 0 || isEditing) && (
        <StudentForm
          dense
          dynamicFields={guestDynamicFields}
          isEditing={isEditing}
          onChange={(guests) => onChange({ ...family, guests })}
          onOpen={onOpen}
          role={StudentRole.GUEST}
          students={family.guests}
        />
      )}
    </form>
  );
};

export default FamilySidebarForm;
