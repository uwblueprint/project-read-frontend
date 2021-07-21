import React, { useContext } from "react";

import { Button, Typography } from "@material-ui/core";

import { FamilyStudentRequest } from "api/types";
import FamilyParentFields from "components/families/family-form/family-parent-fields";
import StudentForm from "components/families/family-form/student-form";
import {
  FamilyFormData,
  familyFormDataToFamilyRequest,
} from "components/families/family-form/utils";
import StudentRole from "constants/StudentRole";
import { DynamicFieldsContext } from "context/DynamicFieldsContext";

type Props = {
  family: FamilyFormData;
  isEditing: boolean;
  onCancel: () => void;
  onChange: (family: FamilyFormData) => void;
  onSubmit: (family: FamilyStudentRequest) => void;
};

const FamilySidebarForm = ({
  family,
  isEditing,
  onCancel,
  onChange,
  onSubmit,
}: Props) => {
  const {
    childDynamicFields,
    guestDynamicFields,
    parentDynamicFields,
  } = useContext(DynamicFieldsContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(familyFormDataToFamilyRequest(family));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h3">Basic information</Typography>
      <FamilyParentFields
        dynamicFields={parentDynamicFields}
        isEditing={isEditing}
        family={family}
        onChange={(value) => onChange({ ...family, ...value })}
      />
      {/* TODO: add session questions here */}

      <Typography variant="h3">Family members</Typography>
      <StudentForm
        dynamicFields={childDynamicFields}
        isEditing={isEditing}
        onChange={(children) => onChange({ ...family, children })}
        role={StudentRole.CHILD}
        students={family.children}
      />
      <StudentForm
        dynamicFields={guestDynamicFields}
        isEditing={isEditing}
        onChange={(guests) => onChange({ ...family, guests })}
        role={StudentRole.GUEST}
        students={family.guests}
      />
      {isEditing && (
        <>
          <Button type="button" variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </>
      )}
    </form>
  );
};

export default FamilySidebarForm;
