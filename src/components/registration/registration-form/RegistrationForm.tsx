import React, { useContext, useState } from "react";

import { Button, Typography } from "@material-ui/core";

import {
  FamilyEnrolmentRequest,
  FamilyStudentRequest,
  StudentRequest,
  SessionDetailResponse,
} from "api/types";
import FamilyForm from "components/families/family-form";
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
    data: FamilyEnrolmentRequest
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
      onSubmit={(e) =>
        onSubmit(e, {
          family,
          session: session.id,
          preferred_class: null, // TODO: change this once we implement preferred_class in the reg form
        })
      }
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
