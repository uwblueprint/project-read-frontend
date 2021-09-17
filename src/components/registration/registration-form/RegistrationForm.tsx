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
import FamilyAPI from "api/FamilyAPI";
import {
  StudentRequest,
  SessionDetailResponse,
  FamilyDetailResponse,
  EnrolmentRequest,
} from "api/types";
import FormRow from "components/common/form-row";
import FamilyParentFields from "components/families/family-form/family-parent-fields";
import StudentDynamicFields from "components/families/family-form/student-dynamic-fields";
import StudentForm from "components/families/family-form/student-form";
import { FamilyFormData } from "components/families/family-form/types";
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
  enrolled_class: null,
  preferred_class: null,
  status: EnrolmentStatus.REGISTERED,
  students: [],
};

type Props = {
  existingFamily: FamilyDetailResponse | null;
  onRegister: (family: FamilyDetailResponse) => void;
  session: SessionDetailResponse;
};

const RegistrationForm = ({ existingFamily, onRegister, session }: Props) => {
  const classes = useStyles();
  const {
    childDynamicFields,
    guestDynamicFields,
    parentDynamicFields,
    sessionDynamicFields,
  } = useContext(DynamicFieldsContext).dynamicFields;

  const [family, setFamily] = useState<FamilyFormData>(
    existingFamily !== null
      ? familyResponseToFamilyFormData(existingFamily)
      : defaultFamilyData
  );
  const [enrolment, setEnrolment] = useState<
    Omit<EnrolmentRequest, "family" | "id">
  >({
    session: session.id,
    ...defaultEnrolmentData,
  });

  useEffect(() => {
    setFamily(
      existingFamily !== null
        ? familyResponseToFamilyFormData(existingFamily)
        : defaultFamilyData
    );
  }, [existingFamily]);

  const getSessionDynamicFields = (dynamicFields: DynamicField[]) =>
    dynamicFields.filter((dynamicField) =>
      session.fields.includes(dynamicField.id)
    );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const familyResponse = existingFamily
        ? await FamilyAPI.putFamily({
            ...familyFormDataToFamilyRequest(family),
            id: existingFamily.id,
          })
        : await FamilyAPI.postFamily(familyFormDataToFamilyRequest(family));
      await EnrolmentAPI.postEnrolment({
        ...enrolment,
        family: familyResponse.id,
        enrolled_class: null,
        // TODO: select students who are attending the session
        students: [
          familyResponse.parent.id,
          ...familyResponse.children.map((child) => child.id),
          ...familyResponse.guests.map((guest) => guest.id),
        ],
      });
      onRegister(familyResponse);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err);
    }
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
          family={family}
          onChange={(value) =>
            setFamily({
              ...family,
              ...value,
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
            setFamily({
              ...family,
              children,
            })
          }
          role={StudentRole.CHILD}
          students={family.children}
        />
        <StudentForm
          dense={false}
          dynamicFields={getSessionDynamicFields(guestDynamicFields)}
          isEditing
          onChange={(guests) =>
            setFamily({
              ...family,
              guests,
            })
          }
          role={StudentRole.GUEST}
          students={family.guests}
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
          information={family.parent.information}
          isEditing
          onChange={(value) =>
            setFamily({
              ...family,
              parent: { ...family.parent, information: value },
            })
          }
          role={StudentRole.SESSION}
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
              setFamily({
                ...family,
                notes: e.target.value,
              })
            }
            value={family.notes}
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
