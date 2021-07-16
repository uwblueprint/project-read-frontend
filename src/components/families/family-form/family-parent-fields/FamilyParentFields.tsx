import React from "react";

import moment from "moment";

import { FamilyRequest, StudentRequest } from "api/types";
import Field from "components/common/field";
import { DefaultFields } from "constants/DefaultFields";
import StudentRole from "constants/StudentRole";
import { DynamicField } from "types";

type FamilyParentRequest = FamilyRequest & { parent: StudentRequest };

type Props = {
  dynamicFields: DynamicField[];
  family: FamilyParentRequest;
  onChange: (data: FamilyParentRequest) => void;
};

const FamilyParentFields = ({ dynamicFields, family, onChange }: Props) => (
  <>
    <Field
      field={{ ...DefaultFields.FIRST_NAME, role: StudentRole.PARENT }}
      onChange={(value) =>
        onChange({ ...family, parent: { ...family.parent, first_name: value } })
      }
      value={family.parent.first_name}
    />
    <Field
      field={{ ...DefaultFields.LAST_NAME, role: StudentRole.PARENT }}
      onChange={(value) =>
        onChange({ ...family, parent: { ...family.parent, last_name: value } })
      }
      value={family.parent.last_name}
    />
    <Field
      field={{ ...DefaultFields.DATE_OF_BIRTH, role: StudentRole.PARENT }}
      onChange={(value) => {
        const dob = value ? moment(value, "YYYY-MM-DD").toDate() : null;
        onChange({
          ...family,
          parent: { ...family.parent, date_of_birth: dob },
        });
      }}
      value={
        family.parent.date_of_birth
          ? moment(family.parent.date_of_birth).format("YYYY-MM-DD")
          : ""
      }
    />
    <Field
      field={{ ...DefaultFields.HOME_NUMBER, role: StudentRole.PARENT }}
      onChange={(value) => onChange({ ...family, home_number: value })}
      value={family.home_number}
    />
    <Field
      field={{ ...DefaultFields.CELL_NUMBER, role: StudentRole.PARENT }}
      onChange={(value) => onChange({ ...family, cell_number: value })}
      value={family.cell_number}
    />
    <Field
      field={{ ...DefaultFields.WORK_NUMBER, role: StudentRole.PARENT }}
      onChange={(value) => onChange({ ...family, work_number: value })}
      value={family.work_number}
    />
    <Field
      field={{ ...DefaultFields.PREFERRED_NUMBER, role: StudentRole.PARENT }}
      onChange={(value) => onChange({ ...family, preferred_number: value })}
      value={family.preferred_number}
    />
    <Field
      field={{ ...DefaultFields.EMAIL, role: StudentRole.PARENT }}
      onChange={(value) => onChange({ ...family, email: value })}
      value={family.email}
    />
    <Field
      field={{ ...DefaultFields.ADDRESS, role: StudentRole.PARENT }}
      onChange={(value) => onChange({ ...family, address: value })}
      value={family.address}
    />
    <Field
      field={{ ...DefaultFields.PREFERRED_CONTACT, role: StudentRole.PARENT }}
      onChange={(value) => onChange({ ...family, preferred_comms: value })}
      value={family.preferred_comms}
    />
    {dynamicFields.map((field) => (
      <Field
        key={field.id}
        field={field}
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
