import React from "react";
import { DynamicField } from "../../../types";
import FieldInput from "./FieldInput";
import { DefaultFields } from "../../../constants/DefaultFields";
import StudentRole from "../../../constants/StudentRole";
import { FamilyRequest, StudentRequest } from "../../../api/FamilyAPI";

type FamilyParentRequest = FamilyRequest & { parent: StudentRequest };

type Props = {
  family: FamilyParentRequest;
  dynamicFields: DynamicField[];
  onChange: (data: FamilyParentRequest) => void;
};

const FamilyFields = ({ family, dynamicFields, onChange }: Props) => (
  <>
    <FieldInput
      field={{ ...DefaultFields.FIRST_NAME, role: StudentRole.PARENT }}
      value={family.parent.first_name}
      onChange={(value) =>
        onChange({
          ...family,
          parent: { ...family.parent, first_name: value },
        })
      }
    />
    <FieldInput
      field={{ ...DefaultFields.LAST_NAME, role: StudentRole.PARENT }}
      value={family.parent.last_name}
      onChange={(value) =>
        onChange({
          ...family,
          parent: { ...family.parent, last_name: value },
        })
      }
    />
    <FieldInput
      field={{ ...DefaultFields.HOME_NUMBER, role: StudentRole.PARENT }}
      value={family.home_number}
      onChange={(value) =>
        onChange({
          ...family,
          home_number: value,
        })
      }
    />
    <FieldInput
      field={{ ...DefaultFields.CELL_NUMBER, role: StudentRole.PARENT }}
      value={family.cell_number}
      onChange={(value) =>
        onChange({
          ...family,
          cell_number: value,
        })
      }
    />
    <FieldInput
      field={{ ...DefaultFields.WORK_NUMBER, role: StudentRole.PARENT }}
      value={family.work_number}
      onChange={(value) =>
        onChange({
          ...family,
          work_number: value,
        })
      }
    />
    <FieldInput
      field={{ ...DefaultFields.PREFERRED_NUMBER, role: StudentRole.PARENT }}
      value={family.preferred_number}
      onChange={(value) =>
        onChange({
          ...family,
          preferred_number: value,
        })
      }
    />
    <FieldInput
      field={{ ...DefaultFields.EMAIL, role: StudentRole.PARENT }}
      value={family.email}
      onChange={(value) =>
        onChange({
          ...family,
          email: value,
        })
      }
    />
    <FieldInput
      field={{ ...DefaultFields.ADDRESS, role: StudentRole.PARENT }}
      value={family.address}
      onChange={(value) =>
        onChange({
          ...family,
          address: value,
        })
      }
    />
    <FieldInput
      field={{ ...DefaultFields.PREFERRED_CONTACT, role: StudentRole.PARENT }}
      value={family.preferred_comms}
      onChange={(value) =>
        onChange({
          ...family,
          preferred_comms: value,
        })
      }
    />
    {dynamicFields.map((field) => (
      <FieldInput
        key={field.id}
        field={field}
        value={family.parent.information[field.id] ?? ""}
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
      />
    ))}
  </>
);
export default FamilyFields;
