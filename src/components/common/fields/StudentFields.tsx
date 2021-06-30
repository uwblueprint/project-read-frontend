import React from "react";
import { DynamicField } from "../../../types";
import FieldInput from "./FieldInput";
import { DefaultFields } from "../../../constants/DefaultFields";
import StudentRole from "../../../constants/StudentRole";
import { StudentRequest } from "../../../api/FamilyAPI";

type Props = {
  student: StudentRequest;
  role: StudentRole;
  dynamicFields: DynamicField[];
  onChange: (data: StudentRequest) => void;
};

const StudentFields = ({ student, role, dynamicFields, onChange }: Props) => (
  <>
    <FieldInput
      field={{ ...DefaultFields.FIRST_NAME, role }}
      value={student.first_name}
      onChange={(value) =>
        onChange({
          ...student,
          first_name: value,
        })
      }
    />
    <FieldInput
      field={{ ...DefaultFields.LAST_NAME, role }}
      value={student.last_name}
      onChange={(value) =>
        onChange({
          ...student,
          last_name: value,
        })
      }
    />
    {dynamicFields.map((field) => (
      <FieldInput
        key={field.id}
        field={field}
        value={student.information[field.id] ?? ""}
        onChange={(value) =>
          onChange({
            ...student,

            information: {
              ...student.information,
              [field.id]: value,
            },
          })
        }
      />
    ))}
  </>
);
export default StudentFields;
