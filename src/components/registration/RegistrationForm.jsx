import React, { useContext, useState } from "react";
import { Button, Typography } from "@material-ui/core";
import { FieldsContext } from "../../context/fields";
import FormFieldGroup from "./FormFieldGroup";
import {
  DefaultFamilyFields,
  DefaultStudentFields,
} from "../../constants/DefaultFields";
import FamilyAPI from "../../api/FamilyAPI";

function RegistrationForm() {
  const { childFields, guestFields, parentFields } = useContext(FieldsContext);

  const [familyData, setFamilyData] = useState({});
  const [parentData, setParentData] = useState({});
  const [childData, setChildData] = useState({});
  const [guestData, setGuestData] = useState({});
  const [parentInfo, setParentInfo] = useState({});
  const [childInfo, setChildInfo] = useState({});
  const [guestInfo, setGuestInfo] = useState({});

  async function onSubmit() {
    const payload = {
      ...familyData,
      parent: { ...parentData, information: { ...parentInfo } },
      children: [
        {
          ...childData,
          information: { ...childInfo },
        },
      ],
      guests: [{ ...guestData, information: { ...guestInfo } }],
    };

    const response = await FamilyAPI.postFamily(payload);
    if (response.non_field_errors) {
      // eslint-disable-next-line no-alert
      alert(response.non_field_errors);
    }
  }

  return (
    <>
      <Typography>Currently enrolling a new family</Typography>
      <div>
        <Typography>Basic information</Typography>
        <FormFieldGroup
          fields={Array.from(DefaultStudentFields)}
          onChange={(data) => setParentData(Object.assign(parentData, data))}
        />
        <FormFieldGroup
          fields={Array.from(DefaultFamilyFields)}
          onChange={(data) => setFamilyData(Object.assign(familyData, data))}
        />
        <FormFieldGroup
          fields={parentFields}
          onChange={(data) => setParentInfo(Object.assign(parentInfo, data))}
        />
      </div>
      <div>
        <Typography>Children</Typography>
        <FormFieldGroup
          fields={Array.from(DefaultStudentFields)}
          onChange={(data) => setChildData(Object.assign(childData, data))}
        />
        <FormFieldGroup
          fields={childFields}
          onChange={(data) => setChildInfo(Object.assign(childInfo, data))}
        />
      </div>
      <div>
        <Typography>Family members</Typography>
        <FormFieldGroup
          fields={Array.from(DefaultStudentFields)}
          onChange={(data) => setGuestData(Object.assign(guestData, data))}
        />
        <FormFieldGroup
          fields={guestFields}
          onChange={(data) => setGuestInfo(Object.assign(guestInfo, data))}
        />
      </div>
      <Button onClick={onSubmit}>Submit</Button>
    </>
  );
}

export default RegistrationForm;
