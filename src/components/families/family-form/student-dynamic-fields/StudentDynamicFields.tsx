import React from "react";

import Field from "components/common/field";
import FieldVariant from "constants/FieldVariant";
import { DynamicField } from "types";

type Props = {
  dense: boolean;
  dynamicFields: DynamicField[];
  index?: number | null;
  information: Record<number, string>;
  isEditing: boolean;
  onChange: (data: Record<number, string>) => void;
  variant: FieldVariant;
};

const defaultProps = {
  index: null,
};

const StudentDynamicFields = ({
  dense,
  dynamicFields,
  index,
  information,
  isEditing,
  onChange,
  variant,
}: Props) => (
  <>
    {dynamicFields.map((field) => (
      <Field
        dense={dense}
        index={index}
        isEditing={isEditing}
        key={field.id}
        field={field}
        onChange={(value) =>
          onChange({
            ...information,
            [field.id]: value,
          })
        }
        value={information[field.id] ?? ""}
        variant={variant}
      />
    ))}
  </>
);

StudentDynamicFields.defaultProps = defaultProps;

export default StudentDynamicFields;
