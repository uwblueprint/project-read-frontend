import React, { useContext } from "react";
import { Typography } from "@material-ui/core";
import { FieldsContext } from "../../context/fields";
import FormFieldGroup from "./FormFieldGroup";
import {
  DefaultFamilyFields,
  DefaultStudentFields,
} from "../../constants/DefaultFields";
import StudentRoles from "../../constants/StudentRoles";

// const formData = {
//   parent: {},
//   children: [{}],
//   guests: [{}],
// };

function RegistrationForm() {
  const { childFields, guestFields, parentFields } = useContext(FieldsContext);

  function onStudentDefaultFieldChange(role, data) {
    console.log(data);
    console.log(role);
  }

  function onStudentFieldChange(role) {
    console.log(role);
  }

  function onFamilyFieldChange() {
    console.log("family");
  }

  return (
    <>
      <div>
        <Typography>Currently enrolling a new family</Typography>
        <Typography>Basic information</Typography>
        <FormFieldGroup
          fields={Array.from(DefaultStudentFields)}
          onChange={(data) =>
            onStudentDefaultFieldChange(StudentRoles.PARENT, data)
          }
        />
        <FormFieldGroup
          fields={Array.from(DefaultFamilyFields)}
          onChange={onFamilyFieldChange}
        />
        <FormFieldGroup
          fields={parentFields}
          onChange={() => onStudentFieldChange(StudentRoles.PARENT)}
        />
      </div>
      <div>
        <Typography>Children</Typography>
        <FormFieldGroup
          fields={Array.from(DefaultStudentFields)}
          onChange={() => onStudentDefaultFieldChange(StudentRoles.CHILD)}
        />
        <FormFieldGroup
          fields={childFields}
          onChange={() => onStudentFieldChange(StudentRoles.CHILD)}
        />
      </div>
      <div>
        <Typography>Family members</Typography>
        <FormFieldGroup
          fields={Array.from(DefaultStudentFields)}
          onChange={() => onStudentDefaultFieldChange(StudentRoles.GUEST)}
        />
        <FormFieldGroup
          fields={guestFields}
          onChange={() => onStudentFieldChange(StudentRoles.GUEST)}
        />
      </div>
    </>
  );
}

export default RegistrationForm;
