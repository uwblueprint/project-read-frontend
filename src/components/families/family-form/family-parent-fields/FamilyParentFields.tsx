import React from "react";

import { FamilyBaseRequest, StudentRequest } from "api/types";
import Field from "components/common/field";
import DefaultFields from "constants/DefaultFields";
import FieldVariant from "constants/FieldVariant";
import StudentRole from "constants/StudentRole";
import { DynamicField } from "types";

import StudentDynamicFields from "../student-dynamic-fields";

type FamilyParentRequest = FamilyBaseRequest & { parent: StudentRequest };

type Props = {
  dense: boolean;
  dynamicFields: DynamicField[];
  family: FamilyParentRequest;
  isEditing: boolean;
  onChange: (data: FamilyParentRequest) => void;
};

const FamilyParentFields = ({
  dense,
  dynamicFields,
  family,
  isEditing,
  onChange,
}: Props) => {
  const fieldProps = { dense, isEditing };
  return (
    <>
      <Field
        field={{ ...DefaultFields.FIRST_NAME, role: StudentRole.PARENT }}
        onChange={(value) =>
          onChange({
            ...family,
            parent: { ...family.parent, first_name: value },
          })
        }
        value={family.parent.first_name}
        {...fieldProps}
      />
      <Field
        field={{ ...DefaultFields.LAST_NAME, role: StudentRole.PARENT }}
        onChange={(value) =>
          onChange({
            ...family,
            parent: { ...family.parent, last_name: value },
          })
        }
        value={family.parent.last_name}
        {...fieldProps}
      />
      <Field
        field={{ ...DefaultFields.DATE_OF_BIRTH, role: StudentRole.PARENT }}
        onChange={(value) => {
          const dob = value || null;
          onChange({
            ...family,
            parent: {
              ...family.parent,
              date_of_birth: dob,
            },
          });
        }}
        value={family.parent.date_of_birth || ""}
        {...fieldProps}
      />
      <Field
        field={{ ...DefaultFields.HOME_NUMBER, role: StudentRole.PARENT }}
        onChange={(value) => onChange({ ...family, home_number: value })}
        value={family.home_number}
        {...fieldProps}
      />
      <Field
        field={{ ...DefaultFields.CELL_NUMBER, role: StudentRole.PARENT }}
        onChange={(value) => onChange({ ...family, cell_number: value })}
        value={family.cell_number}
        {...fieldProps}
      />
      <Field
        field={{ ...DefaultFields.WORK_NUMBER, role: StudentRole.PARENT }}
        onChange={(value) => onChange({ ...family, work_number: value })}
        value={family.work_number}
        {...fieldProps}
      />
      <Field
        field={{ ...DefaultFields.PREFERRED_NUMBER, role: StudentRole.PARENT }}
        onChange={(value) => onChange({ ...family, preferred_number: value })}
        value={family.preferred_number}
        {...fieldProps}
      />
      <Field
        field={{ ...DefaultFields.EMAIL, role: StudentRole.PARENT }}
        onChange={(value) => onChange({ ...family, email: value })}
        value={family.email}
        {...fieldProps}
      />
      <Field
        field={{ ...DefaultFields.ADDRESS, role: StudentRole.PARENT }}
        onChange={(value) => onChange({ ...family, address: value })}
        value={family.address}
        {...fieldProps}
      />
      <Field
        field={{ ...DefaultFields.PREFERRED_CONTACT, role: StudentRole.PARENT }}
        onChange={(value) => onChange({ ...family, preferred_comms: value })}
        value={family.preferred_comms}
        {...fieldProps}
      />
      <StudentDynamicFields
        dense={dense}
        dynamicFields={dynamicFields}
        information={family.parent.information}
        isEditing={isEditing}
        onChange={(value) =>
          onChange({
            ...family,
            parent: { ...family.parent, information: value },
          })
        }
        role={StudentRole.PARENT}
        variant={FieldVariant.DEFAULT}
      />
    </>
  );
};

export default FamilyParentFields;
