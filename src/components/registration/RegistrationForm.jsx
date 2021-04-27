/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { Typography } from "@material-ui/core";
import { FieldsContext } from "../../context/fields";
import FormFieldGroup from "./FormFieldGroup";
import {
  DefaultFamilyFields,
  DefaultStudentFields,
} from "../../constants/DefaultFields";

function RegistrationForm() {
  const { childFields, guestFields, parentFields } = useContext(FieldsContext);

  return (
    <>
      <div>
        <Typography>Currently enrolling a new family</Typography>
        <Typography>Basic information</Typography>
        <FormFieldGroup fields={Array.from(DefaultStudentFields)} />
        <FormFieldGroup fields={Array.from(DefaultFamilyFields)} />
        <FormFieldGroup fields={parentFields} />
      </div>
      <div>
        <Typography>Children</Typography>
        <FormFieldGroup fields={Array.from(DefaultStudentFields)} />
        <FormFieldGroup fields={childFields} />
      </div>
      <div>
        <Typography>Family members</Typography>
        <FormFieldGroup fields={Array.from(DefaultStudentFields)} />
        <FormFieldGroup fields={guestFields} />
      </div>
    </>
  );
}

export default RegistrationForm;
