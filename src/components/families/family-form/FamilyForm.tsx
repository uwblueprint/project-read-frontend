import React from "react";

import { Typography } from "@material-ui/core";

import { FamilyStudentRequest } from "api/types";
import StudentRole from "constants/StudentRole";
import { DynamicField } from "types";

import FamilyParentFields from "./family-parent-fields";
import StudentFields from "./student-fields";

export enum TestId {
  RegistrationForm = "registration-form",
  SessionLabel = "session-label",
}

type Props = {
  family: FamilyStudentRequest;
  childDynamicFields: DynamicField[];
  guestDynamicFields: DynamicField[];
  parentDynamicFields: DynamicField[];
  onChange: (family: FamilyStudentRequest) => void;
};

const FamilyForm = ({
  family,
  childDynamicFields,
  guestDynamicFields,
  parentDynamicFields,
  onChange,
}: Props) => (
  <>
    <Typography component="h3" variant="h5">
      Basic information
    </Typography>
    <FamilyParentFields
      dynamicFields={parentDynamicFields}
      family={family}
      onChange={(value) => onChange({ ...family, ...value })}
    />

    <Typography component="h3" variant="h5">
      Children
    </Typography>
    <StudentFields
      dynamicFields={childDynamicFields}
      onChange={(value) =>
        onChange({
          ...family,
          children: [{ ...family.children[0], ...value }],
        })
      }
      role={StudentRole.CHILD}
      student={family.children[0]}
    />

    <Typography component="h3" variant="h5">
      Family members
    </Typography>
    <StudentFields
      dynamicFields={guestDynamicFields}
      onChange={(value) =>
        onChange({
          ...family,
          guests: [{ ...family.guests[0], ...value }],
        })
      }
      role={StudentRole.GUEST}
      student={family.guests[0]}
    />
  </>
);

export default FamilyForm;
