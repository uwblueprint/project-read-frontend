import React, { useContext, useState } from "react";
import { Button, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { FieldsContext } from "../../context/fields";
import FormFieldGroup from "./FormFieldGroup";
import {
  DefaultFamilyFields,
  DefaultStudentFields,
} from "../../constants/DefaultFields";
import StudentRoles from "../../constants/StudentRoles";

function RegistrationForm({ onSubmit }) {
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

  function getSubmissionData() {
    return {
      ...familyData,
      parent: { ...parentData },
      children: [{ ...childData }],
      guests: [{ ...guestData }],
    };
  }

  return (
    <form onSubmit={() => onSubmit(getSubmissionData())} data-testid="form">
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
      <FormFieldGroup
        fields={DefaultFamilyFields.map((defaultField) => ({
          ...defaultField,
          role: StudentRoles.PARENT,
        }))}
        onChange={setFamilyData}
      />
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
      <Button type="submit" variant="contained" color="primary">
        Done
      </Button>
    </form>
  );
}

RegistrationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default RegistrationForm;
