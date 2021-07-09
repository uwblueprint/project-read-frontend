import React, { useContext, useState } from "react";

import { Button, Typography } from "@material-ui/core";

import {
  FamilyStudentRequest,
  StudentRequest,
  SessionDetailResponse,
} from "api/types";
import FamilyParentFields from "components/common/family-parent-fields";
import StudentFields from "components/common/student-fields";
import DefaultFieldKey from "constants/DefaultFieldKey";
import StudentRole from "constants/StudentRole";
import { DynamicFieldsContext } from "context/DynamicFieldsContext";
import { DynamicField } from "types";

export enum TestId {
  RegistrationForm = "registration-form",
  SessionLabel = "session-label",
}

const defaultStudentData: StudentRequest = {
  [DefaultFieldKey.DATE_OF_BIRTH]: "",
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
  parent: { ...defaultStudentData },
  children: [{ ...defaultStudentData }],
  guests: [{ ...defaultStudentData }],
};

type RegistrationFormProps = {
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    data: FamilyStudentRequest
  ) => void;
  session: SessionDetailResponse;
};

const RegistrationForm = ({ onSubmit, session }: RegistrationFormProps) => {
  const {
    childDynamicFields,
    guestDynamicFields,
    parentDynamicFields,
  } = useContext(DynamicFieldsContext);

  const [family, setFamily] = useState<FamilyStudentRequest>(defaultFamilyData);

  const getSessionDynamicFields = (dynamicFields: DynamicField[]) =>
    dynamicFields.filter((dynamicField) =>
      session.fields.includes(dynamicField.id)
    );

  return (
    <form
      data-testid={TestId.RegistrationForm}
      onSubmit={(e) => onSubmit(e, family)}
    >
      <Typography variant="body1" data-testid={TestId.SessionLabel}>
        Currently enrolling a <b>new family</b> for{" "}
        <b>
          {session.season} {session.year}
        </b>
      </Typography>

      <Typography component="h3" variant="h5">
        Basic information
      </Typography>
      <FamilyParentFields
        dynamicFields={getSessionDynamicFields(parentDynamicFields)}
        family={family}
        onChange={(value) => setFamily((prev) => ({ ...prev, ...value }))}
      />

      <Typography component="h3" variant="h5">
        Children
      </Typography>
      <StudentFields
        dynamicFields={getSessionDynamicFields(childDynamicFields)}
        onChange={(value) =>
          setFamily((prev) => ({
            ...prev,
            children: [{ ...prev.children[0], ...value }],
          }))
        }
        role={StudentRole.CHILD}
        student={family.children[0]}
      />

      <Typography component="h3" variant="h5">
        Family members
      </Typography>
      <StudentFields
        dynamicFields={getSessionDynamicFields(guestDynamicFields)}
        onChange={(value) =>
          setFamily((prev) => ({
            ...prev,
            guests: [{ ...prev.guests[0], ...value }],
          }))
        }
        role={StudentRole.GUEST}
        student={family.guests[0]}
      />

      <Button type="submit" variant="contained" color="primary">
        Done
      </Button>
    </form>
  );
};

export default RegistrationForm;
