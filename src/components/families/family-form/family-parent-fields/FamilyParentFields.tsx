import React from "react";

import { FamilyRequest, StudentRequest } from "api/types";
import Field from "components/common/field";
import { DefaultFields } from "constants/DefaultFields";
import StudentRole from "constants/StudentRole";
import { DynamicField } from "types";

type FamilyParentRequest = FamilyRequest & { parent: StudentRequest };

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
}: Props) => (
  <>
    <Field
      dense={dense}
      field={{ ...DefaultFields.FIRST_NAME, role: StudentRole.PARENT }}
      isEditing={isEditing}
      onChange={(value) =>
        onChange({ ...family, parent: { ...family.parent, first_name: value } })
      }
      value={family.parent.first_name}
    />
    <Field
      dense={dense}
      field={{ ...DefaultFields.LAST_NAME, role: StudentRole.PARENT }}
      isEditing={isEditing}
      onChange={(value) =>
        onChange({ ...family, parent: { ...family.parent, last_name: value } })
      }
      value={family.parent.last_name}
    />
    <Field
      dense={dense}
      field={{ ...DefaultFields.HOME_NUMBER, role: StudentRole.PARENT }}
      isEditing={isEditing}
      onChange={(value) => onChange({ ...family, home_number: value })}
      value={family.home_number}
    />
    <Field
      dense={dense}
      field={{ ...DefaultFields.CELL_NUMBER, role: StudentRole.PARENT }}
      isEditing={isEditing}
      onChange={(value) => onChange({ ...family, cell_number: value })}
      value={family.cell_number}
    />
    <Field
      dense={dense}
      field={{ ...DefaultFields.WORK_NUMBER, role: StudentRole.PARENT }}
      isEditing={isEditing}
      onChange={(value) => onChange({ ...family, work_number: value })}
      value={family.work_number}
    />
    <Field
      dense={dense}
      field={{ ...DefaultFields.PREFERRED_NUMBER, role: StudentRole.PARENT }}
      isEditing={isEditing}
      onChange={(value) => onChange({ ...family, preferred_number: value })}
      value={family.preferred_number}
    />
    <Field
      dense={dense}
      field={{ ...DefaultFields.EMAIL, role: StudentRole.PARENT }}
      isEditing={isEditing}
      onChange={(value) => onChange({ ...family, email: value })}
      value={family.email}
    />
    <Field
      dense={dense}
      field={{ ...DefaultFields.ADDRESS, role: StudentRole.PARENT }}
      isEditing={isEditing}
      onChange={(value) => onChange({ ...family, address: value })}
      value={family.address}
    />
    <Field
      dense={dense}
      field={{ ...DefaultFields.PREFERRED_CONTACT, role: StudentRole.PARENT }}
      isEditing={isEditing}
      onChange={(value) => onChange({ ...family, preferred_comms: value })}
      value={family.preferred_comms}
    />
    {dynamicFields.map((field) => (
      <Field
        key={field.id}
        dense={dense}
        field={field}
        isEditing={isEditing}
        onChange={(value) =>
          onChange({
            ...family,
            parent: {
              ...family.parent,
              information: {
                ...family.parent.information,
                [field.id]: value,
              },
            },
          })
        }
        value={family.parent.information[field.id] ?? ""}
      />
    ))}
  </>
);

export default FamilyParentFields;
