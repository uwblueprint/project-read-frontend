import React from "react";

import { StudentRequest } from "api/types";
import Field from "components/common/field";
import { DefaultFields } from "constants/DefaultFields";
import StudentRole from "constants/StudentRole";
import { DynamicField } from "types";

type Props = {
  dynamicFields: DynamicField[];
  onChange: (data: StudentRequest) => void;
  role: StudentRole;
  student: StudentRequest;
};

const StudentFields = ({ dynamicFields, onChange, role, student }: Props) => (
  <>
    <Field
      field={{ ...DefaultFields.FIRST_NAME, role }}
      onChange={(value) => onChange({ ...student, first_name: value })}
      value={student.first_name}
    />
    <Field
      field={{ ...DefaultFields.LAST_NAME, role }}
      onChange={(value) => onChange({ ...student, last_name: value })}
      value={student.last_name}
    />
    <Field
      field={{ ...DefaultFields.DATE_OF_BIRTH, role }}
      onChange={(value) => onChange({ ...student, date_of_birth: value })}
      value={student.date_of_birth}
    />
    {dynamicFields.map((field) => (
      <Field
        key={field.id}
        field={field}
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
