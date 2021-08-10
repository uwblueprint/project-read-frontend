import React, { useContext, useEffect, useState } from "react";

import {
  Box,
  Button,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/styles";

import EnrolmentAPI from "api/EnrolmentAPI";
import {
  StudentRequest,
  SessionDetailResponse,
  EnrolmentFamilyResponse,
  FamilyDetailResponse,
} from "api/types";
import FormRow from "components/common/form-row";
import FamilyParentFields from "components/families/family-form/family-parent-fields";
import StudentDynamicFields from "components/families/family-form/student-dynamic-fields";
import StudentForm from "components/families/family-form/student-form";
import {
  EnrolmentFormData,
  FamilyFormData,
} from "components/families/family-form/types";
import {
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
  placeholder: {
    color: grey[500],
  },
  sessionLabel: {
    fontSize: 24,
    marginTop: 24,
  },
}));

export enum TestId {
  NotesInput = "notes-input",
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
  [DefaultFieldKey.NOTES]: "",
  [DefaultFieldKey.PREFERRED_CONTACT]: "",
  [DefaultFieldKey.PREFERRED_NUMBER]: "",
  [DefaultFieldKey.WORK_NUMBER]: "",
  parent: { ...defaultStudentData },
  children: [{ ...defaultStudentData, index: 0 }],
  guests: [],
  interactions: [],
};

export const defaultEnrolmentData = {
  preferred_class: null,
  status: EnrolmentStatus.REGISTERED,
};

type Props = {
  existingFamily: FamilyDetailResponse | null;
  onRegister: (enrolment: EnrolmentFamilyResponse) => void;
  session: SessionDetailResponse;
};

const RegistrationForm = ({ existingFamily, onRegister, session }: Props) => {
  const classes = useStyles();
  const {
    childDynamicFields,
    guestDynamicFields,
    parentDynamicFields,
    sessionDynamicFields,
  } = useContext(DynamicFieldsContext);

  const [enrolment, setEnrolment] = useState<EnrolmentFormData>({
    family: { ...defaultFamilyData },
    session: session.id,
    ...defaultEnrolmentData,
  });

  useEffect(() => {
    setEnrolment({
      family:
        existingFamily !== null
          ? familyResponseToFamilyFormData(existingFamily)
          : defaultFamilyData,
      session: session.id,
      ...defaultEnrolmentData,
    });
  }, [existingFamily]);

  const getSessionDynamicFields = (dynamicFields: DynamicField[]) =>
    dynamicFields.filter((dynamicField) =>
      session.fields.includes(dynamicField.id)
    );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (existingFamily === null) {
      try {
        onRegister(
          await EnrolmentAPI.postEnrolment({
            ...enrolment,
            family: familyFormDataToFamilyRequest(enrolment.family),
          })
        );
      } catch (err) {
        // eslint-disable-next-line no-alert
        alert(err);
      }
    }
    // TODO: if there was an existing family, make a PUT request and call onRegister
  };

  return (
    <form data-testid={TestId.RegistrationForm} onSubmit={onSubmit}>
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
      </Box>

      <Box width={408}>
        <Typography variant="h3" className={classes.heading}>
          Session questions
        </Typography>
        <FormRow
          id="preferred-class"
          label="What are your preferred dates?"
          questionType={QuestionType.SELECT}
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
            <MenuItem value="">
              <span className={classes.placeholder}>Select</span>
            </MenuItem>
            {session.classes.map((classObj) => (
              <MenuItem key={classObj.id} value={classObj.id.toString()}>
                {classObj.name}
              </MenuItem>
            ))}
          </Select>
        </FormRow>
        <StudentDynamicFields
          dense={false}
          dynamicFields={getSessionDynamicFields(sessionDynamicFields)}
          information={enrolment.family.parent.information}
          isEditing
          onChange={(value) =>
            setEnrolment({
              ...enrolment,
              family: {
                ...enrolment.family,
                parent: { ...enrolment.family.parent, information: value },
              },
            })
          }
          variant={FieldVariant.STACKED}
        />

        <Typography variant="h3" className={classes.heading}>
          Status
        </Typography>
        <FormRow
          id="status"
          label="Which status would you like to assign?"
          questionType={QuestionType.SELECT}
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

      <Box width={840}>
        <Typography variant="h3" className={classes.heading}>
          Notes
        </Typography>
        <FormRow
          id="notes"
          label="Notes"
          questionType={QuestionType.TEXT}
          variant={FieldVariant.COMPACT}
        >
          <OutlinedInput
            fullWidth
            id="notes"
            inputProps={{ "data-testid": TestId.NotesInput }}
            multiline
            onChange={(e) =>
              setEnrolment({
                ...enrolment,
                family: { ...enrolment.family, notes: e.target.value },
              })
            }
            value={enrolment.family.notes}
          />
        </FormRow>
      </Box>

      <Button type="submit" variant="contained" color="primary">
        Done
      </Button>
    </form>
  );
};

export default RegistrationForm;
