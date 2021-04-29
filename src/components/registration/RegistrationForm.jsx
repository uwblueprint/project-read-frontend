import React, { useContext, useState } from "react";
import { Button, Typography } from "@material-ui/core";
import { FieldsContext } from "../../context/fields";
import FormFieldGroup from "./FormFieldGroup";
import {
  DefaultFamilyFields,
  DefaultStudentFields,
} from "../../constants/DefaultFields";
import FamilyAPI from "../../api/FamilyAPI";
import StudentRoles from "../../constants/StudentRoles";

function RegistrationForm() {
  const { childFields, guestFields, parentFields } = useContext(FieldsContext);

  const [familyData, setFamilyData] = useState({});
  const [parentData, setParentData] = useState({ information: {} });
  const [childData, setChildData] = useState({ information: {} });
  const [guestData, setGuestData] = useState({ information: {} });

  const getDefaultStudentFields = (role) =>
    DefaultStudentFields.map((defaultField) => ({
      ...defaultField,
      role,
    }));

  function onChangeParentData(data) {
    setParentData(Object.assign(parentData, data));
  }

  function onChangeParentInfo(info) {
    setParentData(
      Object.assign(parentData, { ...parentData, information: info })
    );
  }

  function onChangeChildData(data) {
    setChildData(Object.assign(childData, data));
  }

  function onChangeChildInfo(info) {
    setChildData(Object.assign(childData, { ...childData, information: info }));
  }

  function onChangeGuestData(data) {
    setGuestData(Object.assign(guestData, data));
  }

  function onChangeGuestInfo(info) {
    setGuestData(Object.assign(guestData, { ...guestData, information: info }));
  }

  async function onSubmit() {
    const payload = {
      ...familyData,
      parent: { ...parentData },
      children: [{ ...childData }],
      guests: [{ ...guestData }],
    };

    const response = await FamilyAPI.postFamily(payload);
    if (response.non_field_errors) {
      // eslint-disable-next-line no-alert
      alert(response.non_field_errors);
    }
  }

  return (
    <>
      <Typography variant="body1">
        Currently enrolling a <b>new family</b> for <b>the latest session</b>
      </Typography>

      <Typography component="h3" variant="h5">
        Basic information
      </Typography>
      <FormFieldGroup
        fields={getDefaultStudentFields(StudentRoles.PARENT)}
        onChange={onChangeParentData}
      />
      <FormFieldGroup fields={DefaultFamilyFields} onChange={setFamilyData} />
      <FormFieldGroup fields={parentFields} onChange={onChangeParentInfo} />

      <Typography component="h3" variant="h5">
        Children
      </Typography>
      <FormFieldGroup
        fields={getDefaultStudentFields(StudentRoles.CHILD)}
        onChange={onChangeChildData}
      />
      <FormFieldGroup fields={childFields} onChange={onChangeChildInfo} />

      <Typography component="h3" variant="h5">
        Family members
      </Typography>
      <FormFieldGroup
        fields={getDefaultStudentFields(StudentRoles.GUEST)}
        onChange={onChangeGuestData}
      />
      <FormFieldGroup fields={guestFields} onChange={onChangeGuestInfo} />
      <Button onClick={onSubmit} variant="contained" color="primary">
        Done
      </Button>
    </>
  );
}

export default RegistrationForm;
