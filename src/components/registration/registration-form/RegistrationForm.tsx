import React, { useContext, useState } from "react";
import { Button, Typography } from "@material-ui/core";
import { DynamicFieldsContext } from "../../../context/DynamicFieldsContext";
import FormFieldGroup from "../FormFieldGroup";
import {
  DefaultFamilyFormFields,
  DefaultStudentFormFields,
} from "../../../constants/DefaultFields";
import StudentRole from "../../../constants/StudentRole";
import {
  FamilyRequest,
  FamilyStudentRequest,
  StudentRequest,
} from "../../../api/FamilyAPI";
import { DefaultFormField } from "../../../hooks/useFormFields";
import DefaultFieldKey from "../../../constants/DefaultFieldKey";

export enum DataTestId {
  ChildrenDefaultFields = "children-default-fields",
  ChildrenDynamicFields = "children-dynamic-fields",
  FamilyDefaultFields = "family-default-fields",
  GuestsDefaultFields = "guests-default-fields",
  GuestsDynamicFields = "guests-dynamic-fields",
  ParentDefaultFields = "parent-default-fields",
  ParentDynamicFields = "parent-dynamic-fields",
  RegistrationForm = "registration-form",
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
};

const RegistrationForm = ({ onSubmit }: RegistrationFormProps) => {
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

  const getSubmissionData = (): FamilyStudentRequest => ({
    ...familyData,
    parent: { ...parentData },
    children: [{ ...childData }],
    guests: [{ ...guestData }],
  });

  return (
    <form
      data-testid={DataTestId.RegistrationForm}
      onSubmit={(e) => onSubmit(e, getSubmissionData())}
    >
      <Typography variant="body1">
        Currently enrolling a <b>new family</b> for <b>the latest session</b>
      </Typography>

      <Typography component="h3" variant="h5">
        Basic information
      </Typography>
      <FormFieldGroup
        testId={DataTestId.ParentDefaultFields}
        fields={getDefaultStudentFields(StudentRole.PARENT)}
        onChange={(data) => setParentData(Object.assign(parentData, data))}
      />
      <FormFieldGroup
        testId={DataTestId.FamilyDefaultFields}
        fields={getDefaultFamilyFields()}
        onChange={setFamilyData}
      />
      <FormFieldGroup
        testId={DataTestId.ParentDynamicFields}
        fields={parentDynamicFields}
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
        testId={DataTestId.ChildrenDefaultFields}
        fields={getDefaultStudentFields(StudentRole.CHILD)}
        onChange={(data) => setChildData(Object.assign(childData, data))}
      />
      <FormFieldGroup
        testId={DataTestId.ChildrenDynamicFields}
        fields={childDynamicFields}
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
        testId={DataTestId.GuestsDefaultFields}
        fields={getDefaultStudentFields(StudentRole.GUEST)}
        onChange={(data) => setGuestData(Object.assign(guestData, data))}
      />
      <FormFieldGroup
        testId={DataTestId.GuestsDynamicFields}
        fields={guestDynamicFields}
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
