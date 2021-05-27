import React, { useContext, useState } from "react";
import { Button, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { DynamicFieldsContext } from "../../context/DynamicFieldsContext";
import FormFieldGroup from "./FormFieldGroup";
import {
  DefaultFamilyFormFields,
  DefaultStudentFormFields,
} from "../../constants/DefaultFields";
import StudentRoles from "../../constants/StudentRoles";

function RegistrationForm({ onSubmit }) {
  const {
    childDynamicFields,
    guestDynamicFields,
    parentDynamicFields,
  } = useContext(DynamicFieldsContext);

  const [familyData, setFamilyData] = useState({});
  const [parentData, setParentData] = useState({ information: {} });
  const [childData, setChildData] = useState({ information: {} });
  const [guestData, setGuestData] = useState({ information: {} });

  function getDefaultStudentFields(role) {
    return DefaultStudentFormFields.map((defaultField) => ({
      ...defaultField,
      role,
    }));
  }

  function getDefaultFamilyFields() {
    return DefaultFamilyFormFields.map((defaultField) => ({
      ...defaultField,
      role: StudentRoles.PARENT,
    }));
  }

  function onChangeStudentData(role, data, isInfo) {
    if (role === StudentRoles.PARENT) {
      return isInfo
        ? setParentData(
            Object.assign(parentData, { ...parentData, information: data })
          )
        : setParentData(Object.assign(parentData, data));
    }
    if (role === StudentRoles.CHILD) {
      return isInfo
        ? setChildData(
            Object.assign(childData, { ...childData, information: data })
          )
        : setChildData(Object.assign(childData, data));
    }
    if (role === StudentRoles.GUEST) {
      return isInfo
        ? setGuestData(
            Object.assign(guestData, { ...guestData, information: data })
          )
        : setGuestData(Object.assign(guestData, data));
    }
    return null;
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
    <form onSubmit={(e) => onSubmit(e, getSubmissionData())}>
      <Typography variant="body1">
        Currently enrolling a <b>new family</b> for <b>the latest session</b>
      </Typography>

      <Typography component="h3" variant="h5">
        Basic information
      </Typography>
      <FormFieldGroup
        fields={getDefaultStudentFields(StudentRoles.PARENT)}
        onChange={(data) =>
          onChangeStudentData(StudentRoles.PARENT, data, false)
        }
      />
      <FormFieldGroup
        fields={getDefaultFamilyFields()}
        onChange={setFamilyData}
      />
      <FormFieldGroup
        fields={parentDynamicFields}
        onChange={(data) =>
          onChangeStudentData(StudentRoles.PARENT, data, true)
        }
      />

      <Typography component="h3" variant="h5">
        Children
      </Typography>
      <FormFieldGroup
        fields={getDefaultStudentFields(StudentRoles.CHILD)}
        onChange={(data) =>
          onChangeStudentData(StudentRoles.CHILD, data, false)
        }
      />
      <FormFieldGroup
        fields={childDynamicFields}
        onChange={(data) => onChangeStudentData(StudentRoles.CHILD, data, true)}
      />

      <Typography component="h3" variant="h5">
        Family members
      </Typography>
      <FormFieldGroup
        fields={getDefaultStudentFields(StudentRoles.GUEST)}
        onChange={(data) =>
          onChangeStudentData(StudentRoles.GUEST, data, false)
        }
      />
      <FormFieldGroup
        fields={guestDynamicFields}
        onChange={(data) => onChangeStudentData(StudentRoles.GUEST, data, true)}
      />

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
