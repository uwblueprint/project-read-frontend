import React, { useContext, useState } from "react";

import { Box, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import FamilyAPI from "api/FamilyAPI";
import {
  StudentRequest,
  SessionDetailResponse,
  FamilyDetailResponse,
} from "api/types";
import FamilyParentFields from "components/families/family-form/family-parent-fields";
import StudentForm from "components/families/family-form/student-form";
import {
  FamilyFormData,
  familyFormDataToFamilyRequest,
  familyResponseToFamilyFormData,
} from "components/families/family-form/utils";
import DefaultFieldKey from "constants/DefaultFieldKey";
import StudentRole from "constants/StudentRole";
import { DynamicFieldsContext } from "context/DynamicFieldsContext";
import { DynamicField } from "types";

const useStyles = makeStyles(() => ({
  heading: {
    marginBottom: 24,
    marginTop: 32,
  },
  sessionLabel: {
    fontSize: 24,
    marginTop: 24,
  },
}));

export enum TestId {
  RegistrationForm = "registration-form",
  SessionLabel = "session-label",
}

const defaultStudentData: StudentRequest = {
  [DefaultFieldKey.DATE_OF_BIRTH]: null,
  [DefaultFieldKey.FIRST_NAME]: "",
  [DefaultFieldKey.LAST_NAME]: "",
  information: {},
};

const defaultFamilyData: FamilyFormData = {
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
  const classes = useStyles();
  const {
    childDynamicFields,
    guestDynamicFields,
    parentDynamicFields,
  } = useContext(DynamicFieldsContext);

  const [family, setFamily] = useState<FamilyFormData>(
    existingFamily !== null
      ? familyResponseToFamilyFormData(existingFamily)
      : defaultFamilyData
  );

  const getSessionDynamicFields = (dynamicFields: DynamicField[]) =>
    dynamicFields.filter((dynamicField) =>
      session.fields.includes(dynamicField.id)
    );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (existingFamily === null) {
      const response = await FamilyAPI.postFamily(
        familyFormDataToFamilyRequest(family)
      );
      if (response.non_field_errors) {
        // eslint-disable-next-line no-alert
        alert(response.non_field_errors);
        return;
      }
    }
    // TODO: if there was an existing family, make a PUT request
    onSubmit();
  };

  return (
    <form data-testid={TestId.RegistrationForm} onSubmit={handleSubmit}>
      <Typography
        variant="body1"
        data-testid={TestId.SessionLabel}
        className={classes.sessionLabel}
      >
        Currently enrolling{" "}
        {existingFamily !== null ? (
          <span>
            the family of{" "}
            <b>
              {existingFamily.parent.first_name}{" "}
              {existingFamily.parent.last_name}
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

      <Box width={488}>
        <Typography variant="h3" className={classes.heading}>
          Basic information
        </Typography>
        <FamilyParentFields
          dense={false}
          dynamicFields={getSessionDynamicFields(parentDynamicFields)}
          isEditing
          family={family}
          onChange={(value) => setFamily({ ...family, ...value })}
        />

        <Typography variant="h3" className={classes.heading}>
          Family members
        </Typography>
        <StudentForm
          dense={false}
          dynamicFields={getSessionDynamicFields(childDynamicFields)}
          isEditing
          onChange={(children) => setFamily({ ...family, children })}
          role={StudentRole.CHILD}
          students={family.children}
        />
        <StudentForm
          dense={false}
          dynamicFields={getSessionDynamicFields(guestDynamicFields)}
          isEditing
          onChange={(guests) => setFamily({ ...family, guests })}
          role={StudentRole.GUEST}
          students={family.guests}
        />
      </Box>

      <Button type="submit" variant="contained" color="primary">
        Done
      </Button>
    </form>
  );
};

export default RegistrationForm;
