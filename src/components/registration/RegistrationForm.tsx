import React, { useContext, useState } from "react";
import { Button, Typography } from "@material-ui/core";
import DefaultFieldKey from "../../constants/DefaultFieldKey";
import { DynamicFieldsContext } from "../../context/DynamicFieldsContext";
import FamilyParentFields from "../common/fields/FamilyParentFields";
import StudentFields from "../common/fields/StudentFields";
import { FamilyStudentRequest, StudentRequest } from "../../api/FamilyAPI";
import StudentRole from "../../constants/StudentRole";

export enum TestId {
  RegistrationForm = "registration-form",
}

const defaultStudentData: StudentRequest = {
  [DefaultFieldKey.FIRST_NAME]: "",
  [DefaultFieldKey.LAST_NAME]: "",
  information: {},
};

const defaultFamilyData: FamilyStudentRequest = {
  [DefaultFieldKey.ADDRESS]: "",
  [DefaultFieldKey.CELL_NUMBER]: "",
  [DefaultFieldKey.EMAIL]: "",
  [DefaultFieldKey.HOME_NUMBER]: "",
  [DefaultFieldKey.PREFERRED_CONTACT]: "",
  [DefaultFieldKey.PREFERRED_NUMBER]: "",
  [DefaultFieldKey.WORK_NUMBER]: "",
  parent: {
    [DefaultFieldKey.FIRST_NAME]: "",
    [DefaultFieldKey.LAST_NAME]: "",
    information: {},
  },
  children: [{ ...defaultStudentData }],
  guests: [{ ...defaultStudentData }],
};

type RegistrationFormProps = {
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    data: FamilyStudentRequest
  ) => void;
};

const RegistrationForm = ({ onSubmit }: RegistrationFormProps) => {
  const {
    childDynamicFields,
    guestDynamicFields,
    parentDynamicFields,
  } = useContext(DynamicFieldsContext);

  const [family, setFamily] = useState<FamilyStudentRequest>(defaultFamilyData);

  return (
    <form
      data-testid={TestId.RegistrationForm}
      onSubmit={(e) => onSubmit(e, family)}
    >
      <Typography variant="body1">
        Currently enrolling a <b>new family</b> for <b>the latest session</b>
      </Typography>

      <Typography component="h3" variant="h5">
        Basic information
      </Typography>
      <FamilyParentFields
        family={family}
        dynamicFields={parentDynamicFields}
        onChange={(value) => setFamily((prev) => ({ ...prev, ...value }))}
      />

      <Typography component="h3" variant="h5">
        Children
      </Typography>
      <StudentFields
        student={family.children[0]}
        role={StudentRole.CHILD}
        dynamicFields={childDynamicFields}
        onChange={(value) =>
          setFamily((prev) => ({
            ...prev,
            children: [{ ...prev.children[0], ...value }],
          }))
        }
      />

      <Typography component="h3" variant="h5">
        Family members
      </Typography>
      <StudentFields
        student={family.guests[0]}
        role={StudentRole.GUEST}
        dynamicFields={guestDynamicFields}
        onChange={(value) =>
          setFamily((prev) => ({
            ...prev,
            guests: [{ ...prev.guests[0], ...value }],
          }))
        }
      />

      <Button type="submit" variant="contained" color="primary">
        Done
      </Button>
    </form>
  );
};

export default RegistrationForm;
