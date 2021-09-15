import React from "react";

import { Box, Tooltip } from "@material-ui/core";

import AddButton from "components/common/add-button";
import QuestionType from "constants/QuestionType";
import StudentRole from "constants/StudentRole";
import { DynamicField, FieldType } from "types";

import FieldEditor from "../field-editor";

export type NewDynamicField = Omit<DynamicField, "id">;

const getMaxOrder = (fields: DynamicField[]): number =>
  fields.reduce((a, b) => (a.order > b.order ? a : b)).order;

const getNewDynamicFieldData = (
  role: StudentRole,
  order: number
): NewDynamicField => ({
  is_default: false,
  name: "",
  options: ["Option 1"],
  order,
  question_type: QuestionType.TEXT,
  role,
  type: FieldType.Dynamic,
});

type Props = {
  existingFields: DynamicField[];
  newField: NewDynamicField | null;
  onAdd: (data: NewDynamicField) => void;
  onSubmit: () => void;
  role: StudentRole;
};

const NewFieldEditor = ({
  existingFields,
  newField,
  onAdd,
  onSubmit,
  role,
}: Props) => {
  const isAddDisabled = newField !== null;
  return (
    <>
      {newField && (
        <FieldEditor
          field={newField}
          isReadOnly={false}
          onSubmit={onSubmit}
          role={StudentRole.CHILD}
        />
      )}
      <Box marginY={2}>
        <Tooltip
          aria-label={
            isAddDisabled
              ? "Save your current question before adding a new one"
              : ""
          }
          title={
            isAddDisabled
              ? "Save your current question before adding a new one"
              : ""
          }
        >
          <span>
            <AddButton
              disabled={isAddDisabled}
              label="Add a question"
              onClick={() =>
                onAdd(
                  getNewDynamicFieldData(role, getMaxOrder(existingFields) + 1)
                )
              }
            />
          </span>
        </Tooltip>
      </Box>
    </>
  );
};

export default NewFieldEditor;
