import React, { useEffect, useState, createContext, ReactNode } from "react";
import FieldAPI from "../api/FieldAPI";
import { Field } from "../types";

type StudentFields = {
  parentFields: Field[];
  childFields: Field[];
  guestFields: Field[];
};

export const FieldsContext = createContext<StudentFields>({
  parentFields: [],
  childFields: [],
  guestFields: [],
});

type FieldsProviderProps = {
  children: ReactNode;
};

export const FieldsProvider = ({ children }: FieldsProviderProps) => {
  const [parentFields, setParentFields] = useState<Field[]>([]);
  const [childFields, setChildFields] = useState<Field[]>([]);
  const [guestFields, setGuestFields] = useState<Field[]>([]);

  useEffect(() => {
    async function fetchFields() {
      const fields = await FieldAPI.getFields();
      if (fields.length) {
        setParentFields(fields[0].parent_fields);
        setChildFields(fields[0].child_fields);
        setGuestFields(fields[0].guest_fields);
      }
    }
    fetchFields();
  }, []);

  return (
    <FieldsContext.Provider value={{ parentFields, childFields, guestFields }}>
      {children}
    </FieldsContext.Provider>
  );
};
