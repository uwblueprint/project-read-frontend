import React, { useContext, useState } from "react";

import { Box, Button, MenuItem, Select, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import EnrolmentAPI from "api/EnrolmentAPI";
import {
  StudentRequest,
  SessionDetailResponse,
  FamilyDetailResponse,
} from "api/types";
import FormRow from "components/common/form-row";
import FamilyParentFields from "components/families/family-form/family-parent-fields";
import StudentForm from "components/families/family-form/student-form";
import {
  EnrolmentFormData,
  FamilyFormData,
  familyFormDataToFamilyRequest,
  familyResponseToFamilyFormData,
} from "components/families/family-form/utils";
import DefaultFieldKey from "constants/DefaultFieldKey";
import EnrolmentStatus from "constants/EnrolmentStatus";
import FieldVariant from "constants/FieldVariant";
import QuestionType from "constants/QuestionType";
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
  PreferredClassSelect = "preferred-class-select",
  RegistrationForm = "registration-form",
  SessionLabel = "session-label",
  StatusSelect = "status-select",
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

  const [enrolment, setEnrolment] = useState<EnrolmentFormData>({
    family:
      existingFamily !== null
        ? familyResponseToFamilyFormData(existingFamily)
        : defaultFamilyData,
    preferred_class: null,
    session: session.id,
    status: EnrolmentStatus.REGISTERED,
  });

  const getSessionDynamicFields = (dynamicFields: DynamicField[]) =>
    dynamicFields.filter((dynamicField) =>
      session.fields.includes(dynamicField.id)
    );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (existingFamily === null) {
      const response = await EnrolmentAPI.postEnrolment({
        ...enrolment,
        family: familyFormDataToFamilyRequest(enrolment.family),
      });
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
        for <b>{session.name}</b>
      </Typography>

      <Box width={488}>
        <Typography variant="h3" className={classes.heading}>
          Basic information
        </Typography>
        <FamilyParentFields
          dense={false}
          dynamicFields={getSessionDynamicFields(parentDynamicFields)}
          isEditing
          family={enrolment.family}
          onChange={(value) =>
            setEnrolment({
              ...enrolment,
              family: { ...enrolment.family, ...value },
            })
          }
        />

        <Typography variant="h3" className={classes.heading}>
          Family members
        </Typography>
        <StudentForm
          dense={false}
          dynamicFields={getSessionDynamicFields(childDynamicFields)}
          isEditing
          onChange={(children) =>
            setEnrolment({
              ...enrolment,
              family: { ...enrolment.family, children },
            })
          }
          role={StudentRole.CHILD}
          students={enrolment.family.children}
        />
        <StudentForm
          dense={false}
          dynamicFields={getSessionDynamicFields(guestDynamicFields)}
          isEditing
          onChange={(guests) =>
            setEnrolment({
              ...enrolment,
              family: { ...enrolment.family, guests },
            })
          }
          role={StudentRole.GUEST}
          students={enrolment.family.guests}
        />

        <Typography variant="h3" className={classes.heading}>
          Session questions
        </Typography>
        <FormRow
          id="preferred-class"
          label="What are your preferred dates?"
          questionType={QuestionType.MULTIPLE_CHOICE}
          variant={FieldVariant.STACKED}
        >
          <Select
            displayEmpty
            fullWidth
            inputProps={{ "data-testid": TestId.PreferredClassSelect }}
            labelId="preferred-class"
            onChange={(e) =>
              setEnrolment({
                ...enrolment,
                preferred_class: Number(e.target.value),
              })
            }
            value={enrolment.preferred_class || ""}
            variant="outlined"
          >
            <MenuItem value="">Select</MenuItem>
            {session.classes.map((classObj) => (
              <MenuItem key={classObj.id} value={classObj.id.toString()}>
                {classObj.name}
              </MenuItem>
            ))}
          </Select>
        </FormRow>

        <Typography variant="h3" className={classes.heading}>
          Status
        </Typography>
        <FormRow
          id="status"
          label="Which status would you like to assign?"
          questionType={QuestionType.MULTIPLE_CHOICE}
          variant={FieldVariant.STACKED}
        >
          <Select
            fullWidth
            inputProps={{ "data-testid": TestId.StatusSelect }}
            labelId="status"
            onChange={(e) =>
              setEnrolment({
                ...enrolment,
                status: e.target.value as EnrolmentStatus,
              })
            }
            value={enrolment.status}
            variant="outlined"
          >
            <MenuItem value={EnrolmentStatus.REGISTERED}>
              Registered (all or most information is complete)
            </MenuItem>
            <MenuItem value={EnrolmentStatus.SIGNED_UP}>
              Signed up (more information is required)
            </MenuItem>
          </Select>
        </FormRow>
      </Box>

      <Button type="submit" variant="contained" color="primary">
        Done
      </Button>
    </form>
  );
};

export default RegistrationForm;
