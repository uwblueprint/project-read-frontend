import React from "react";

import moment from "moment";

import { StudentRequest } from "api/types";
import Field from "components/common/field";
import { DefaultFields } from "constants/DefaultFields";
import FieldVariant from "constants/FieldVariant";
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
      variant={FieldVariant.COMPACT}
    />
    <Field
      field={{ ...DefaultFields.LAST_NAME, role }}
      onChange={(value) => onChange({ ...student, last_name: value })}
      value={student.last_name}
      variant={FieldVariant.COMPACT}
    />
    <Field
      field={{ ...DefaultFields.DATE_OF_BIRTH, role }}
      onChange={(value) => {
        const dob = value || null;
        onChange({
          ...student,
          date_of_birth: dob,
        });
      }}
      value={
        student.date_of_birth
          ? moment(student.date_of_birth).format("YYYY-MM-DD")
          : ""
      }
      variant={FieldVariant.COMPACT}
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
        variant={FieldVariant.COMPACT}
      />
    ))}
  </>
);

export default StudentFields;
