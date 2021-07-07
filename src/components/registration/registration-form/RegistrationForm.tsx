import React, { useContext, useState } from "react";

import { Button, Typography } from "@material-ui/core";

import {
  FamilyRequest,
  FamilyStudentRequest,
  StudentRequest,
} from "api/FamilyAPI";
import { SessionDetailResponse } from "api/SessionAPI";
import DefaultFieldKey from "constants/DefaultFieldKey";
import {
  DefaultFamilyFormFields,
  DefaultStudentFormFields,
} from "constants/DefaultFields";
import StudentRole from "constants/StudentRole";
import { DynamicFieldsContext } from "context/DynamicFieldsContext";
import { DefaultFormField } from "hooks/useFormFields";
import { DynamicField } from "types";

import FormFieldGroup from "../FormFieldGroup";

export enum TestId {
  ChildrenDefaultFields = "children-default-fields",
  ChildrenDynamicFields = "children-dynamic-fields",
  FamilyDefaultFields = "family-default-fields",
  GuestsDefaultFields = "guests-default-fields",
  GuestsDynamicFields = "guests-dynamic-fields",
  ParentDefaultFields = "parent-default-fields",
  ParentDynamicFields = "parent-dynamic-fields",
  RegistrationForm = "registration-form",
  SessionLabel = "session-label",
}

const defaultFamilyRequestData: FamilyRequest = {
  [DefaultFieldKey.ADDRESS]: "",
  [DefaultFieldKey.CELL_NUMBER]: "",
  [DefaultFieldKey.EMAIL]: "",
  [DefaultFieldKey.HOME_NUMBER]: "",
  [DefaultFieldKey.PREFERRED_CONTACT]: "",
  [DefaultFieldKey.PREFERRED_NUMBER]: "",
  [DefaultFieldKey.WORK_NUMBER]: "",
};

const defaultStudentRequestData: StudentRequest = {
  [DefaultFieldKey.FIRST_NAME]: "",
  [DefaultFieldKey.LAST_NAME]: "",
  information: {},
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

  const [familyData, setFamilyData] = useState<FamilyRequest>({
    ...defaultFamilyRequestData,
  });
  const [parentData, setParentData] = useState<StudentRequest>({
    ...defaultStudentRequestData,
  });
  const [childData, setChildData] = useState<StudentRequest>({
    ...defaultStudentRequestData,
  });
  const [guestData, setGuestData] = useState<StudentRequest>({
    ...defaultStudentRequestData,
  });

  const getDefaultStudentFields = (role: StudentRole): DefaultFormField[] =>
    DefaultStudentFormFields.map((defaultField) => ({
      ...defaultField,
      role,
    }));

  const getDefaultFamilyFields = (): DefaultFormField[] =>
    DefaultFamilyFormFields.map((defaultField) => ({
      ...defaultField,
      role: StudentRole.PARENT,
    }));

  const getSessionDynamicFields = (dynamicFields: DynamicField[]) =>
    dynamicFields.filter((dynamicField) =>
      session.fields.includes(dynamicField.id)
    );

  const getSubmissionData = (): FamilyStudentRequest => ({
    ...familyData,
    parent: { ...parentData },
    children: [{ ...childData }],
    guests: [{ ...guestData }],
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

      <Typography component="h3" variant="h5">
        Basic information
      </Typography>
      <FormFieldGroup
        testId={TestId.ParentDefaultFields}
        fields={getDefaultStudentFields(StudentRole.PARENT)}
        onChange={(data) => setParentData(Object.assign(parentData, data))}
      />
      <FormFieldGroup
        testId={TestId.FamilyDefaultFields}
        fields={getDefaultFamilyFields()}
        onChange={setFamilyData}
      />
      <FormFieldGroup
        testId={TestId.ParentDynamicFields}
        fields={getSessionDynamicFields(parentDynamicFields)}
        onChange={(data) =>
          setParentData(
            Object.assign(parentData, { ...parentData, information: data })
          )
        }
      />

      <Typography component="h3" variant="h5">
        Children
      </Typography>
      <FormFieldGroup
        testId={TestId.ChildrenDefaultFields}
        fields={getDefaultStudentFields(StudentRole.CHILD)}
        onChange={(data) => setChildData(Object.assign(childData, data))}
      />
      <FormFieldGroup
        testId={TestId.ChildrenDynamicFields}
        fields={getSessionDynamicFields(childDynamicFields)}
        onChange={(data) =>
          setChildData(
            Object.assign(childData, { ...childData, information: data })
          )
        }
      />

      <Typography component="h3" variant="h5">
        Family members
      </Typography>
      <FormFieldGroup
        testId={TestId.GuestsDefaultFields}
        fields={getDefaultStudentFields(StudentRole.GUEST)}
        onChange={(data) => setGuestData(Object.assign(guestData, data))}
      />
      <FormFieldGroup
        testId={TestId.GuestsDynamicFields}
        fields={getSessionDynamicFields(guestDynamicFields)}
        onChange={(data) =>
          setGuestData(
            Object.assign(guestData, { ...guestData, information: data })
          )
        }
      />

      <Button type="submit" variant="contained" color="primary">
        Done
      </Button>
    </form>
  );
};

export default RegistrationForm;
