import React from "react";

import { StudentRequest } from "api/types";
import Field from "components/common/field";
import { DefaultFields } from "constants/DefaultFields";
import StudentRole from "constants/StudentRole";
import { DynamicField } from "types";

type Props = {
  dense: boolean;
  dynamicFields: DynamicField[];
  isEditing: boolean;
  onChange: (data: StudentRequest) => void;
  role: StudentRole;
  student: StudentRequest;
};

const StudentFields = ({
  dense,
  dynamicFields,
  isEditing,
  onChange,
  role,
  student,
}: Props) => (
  <>
    <Field
      dense={dense}
      field={{ ...DefaultFields.FIRST_NAME, role }}
      isEditing={isEditing}
      onChange={(value) => onChange({ ...student, first_name: value })}
      value={student.first_name}
    />
    <Field
      dense={dense}
      field={{ ...DefaultFields.LAST_NAME, role }}
      isEditing={isEditing}
      onChange={(value) => onChange({ ...student, last_name: value })}
      value={student.last_name}
    />
    {dynamicFields.map((field) => (
      <Field
        key={field.id}
        dense={dense}
        field={field}
        isEditing={isEditing}
        onChange={(value) =>
          onChange({
            ...student,
            information: {
              ...student.information,
              [field.id]: value,
            },
          })
        }
        value={student.information[field.id] ?? ""}
      />
    ))}
  </>
);

export default StudentFields;
