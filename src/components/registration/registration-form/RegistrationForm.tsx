import React, { useContext, useState } from "react";

import { Button, Typography } from "@material-ui/core";

import FamilyAPI from "api/FamilyAPI";
import {
  FamilyStudentRequest,
  StudentRequest,
  SessionDetailResponse,
  FamilyDetailResponse,
} from "api/types";
import FamilyForm, {
  familyResponseToFamilyFormData,
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
  existingFamily: FamilyDetailResponse | null;
  onSubmit: () => void;
  session: SessionDetailResponse;
};

const RegistrationForm = ({
  existingFamily,
  onSubmit,
  session,
}: RegistrationFormProps) => {
  const {
    childDynamicFields,
    guestDynamicFields,
    parentDynamicFields,
  } = useContext(DynamicFieldsContext);

  const [family, setFamily] = useState<FamilyStudentFormData>(
    existingFamily !== null
      ? familyResponseToFamilyFormData(existingFamily)
      : defaultFamilyData
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const requestData: FamilyStudentRequest = {
      ...family,
      children: family.children.map((child) =>
        studentFormDataToStudentRequest(child)
      ),
      guests: family.guests.map((guest) =>
        studentFormDataToStudentRequest(guest)
      ),
    };
    if (existingFamily === null) {
      const response = await FamilyAPI.postFamily(requestData);
      if (response.non_field_errors) {
        // eslint-disable-next-line no-alert
        alert(response.non_field_errors);
        return;
      }
    }
    // TODO: if there was an existing family, make a PUT request
    onSubmit();
  };

  const getSessionDynamicFields = (dynamicFields: DynamicField[]) =>
    dynamicFields.filter((dynamicField) =>
      session.fields.includes(dynamicField.id)
    );

  return (
    <form data-testid={TestId.RegistrationForm} onSubmit={handleSubmit}>
      <Typography variant="body1" data-testid={TestId.SessionLabel}>
        Currently enrolling{" "}
        {existingFamily !== null ? (
          <span>
            the family of{" "}
            <b>
              {family.parent.first_name} {family.parent.last_name}
            </b>
          </span>
        ) : (
          <span>
            a <b>new family</b>
          </span>
        )}{" "}
        for{" "}
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
