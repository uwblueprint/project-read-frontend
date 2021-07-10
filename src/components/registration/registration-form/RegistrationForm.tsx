import React, { useContext, useState } from "react";

import { Button, Typography } from "@material-ui/core";

import {
  FamilyStudentRequest,
  StudentRequest,
  SessionDetailResponse,
} from "api/types";
import FamilyForm, {
  FamilyStudentFormData,
  studentFormDataToStudentRequest,
} from "components/families/family-form";
import DefaultFieldKey from "constants/DefaultFieldKey";
import { DynamicFieldsContext } from "context/DynamicFieldsContext";
import { DynamicField } from "types";

export enum TestId {
  RegistrationForm = "registration-form",
  SessionLabel = "session-label",
}

const defaultStudentData: StudentRequest = {
  [DefaultFieldKey.FIRST_NAME]: "",
  [DefaultFieldKey.LAST_NAME]: "",
  information: {},
};

const defaultFamilyData: FamilyStudentFormData = {
  [DefaultFieldKey.ADDRESS]: "",
  [DefaultFieldKey.CELL_NUMBER]: "",
  [DefaultFieldKey.EMAIL]: "",
  [DefaultFieldKey.HOME_NUMBER]: "",
  [DefaultFieldKey.PREFERRED_CONTACT]: "",
  [DefaultFieldKey.PREFERRED_NUMBER]: "",
  [DefaultFieldKey.WORK_NUMBER]: "",
  parent: { ...defaultStudentData },
  children: [{ ...defaultStudentData, index: 0 }],
  guests: [],
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

  const [family, setFamily] = useState<FamilyStudentFormData>(
    defaultFamilyData
  );

  const getSessionDynamicFields = (dynamicFields: DynamicField[]) =>
    dynamicFields.filter((dynamicField) =>
      session.fields.includes(dynamicField.id)
    );

  const getSubmissionData = (): FamilyStudentRequest => ({
    ...family,
    children: family.children.map((child) =>
      studentFormDataToStudentRequest(child)
    ),
    guests: family.guests.map((guest) =>
      studentFormDataToStudentRequest(guest)
    ),
  });

  return (
    <form
      data-testid={TestId.RegistrationForm}
      onSubmit={(e) => onSubmit(e, getSubmissionData())}
    >
      <Typography variant="body1" data-testid={TestId.SessionLabel}>
        Currently enrolling a <b>new family</b> for{" "}
        <b>
          {session.season} {session.year}
        </b>
      </Typography>

      <FamilyForm
        family={family}
        childDynamicFields={getSessionDynamicFields(childDynamicFields)}
        guestDynamicFields={getSessionDynamicFields(guestDynamicFields)}
        parentDynamicFields={getSessionDynamicFields(parentDynamicFields)}
        onChange={setFamily}
      />

      <Button type="submit" variant="contained" color="primary">
        Done
      </Button>
    </form>
  );
};

export default RegistrationForm;
