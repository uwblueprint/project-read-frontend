import { useState } from "react";
import DefaultFieldKey from "../constants/DefaultFieldKey";
import StudentRole from "../constants/StudentRole";
import { DefaultField, DynamicField } from "../types";

export type DefaultFormField = DefaultField & { role: StudentRole };
export type FormFieldKey = number | DefaultFieldKey;
export type FormFieldData = Record<FormFieldKey, string>;

const useFormFields = (fields: DefaultFormField[] | DynamicField[]) => {
  const [formFieldData, setFormFieldData] = useState<FormFieldData>(
    Object.assign(
      {},
      ...fields.map((field: DefaultFormField | DynamicField) => ({
        [field.id]: "",
      }))
    )
  );

  const onFormFieldDataChange = (fieldId: FormFieldKey, value: string) => {
    setFormFieldData((prev: FormFieldData) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  return { formFieldData, onFormFieldDataChange };
};

export default useFormFields;
