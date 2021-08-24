import React, { useEffect, useState, createContext, ReactNode } from "react";

import DynamicFieldAPI from "api/DynamicFieldAPI";
import { DynamicField } from "types";

type DynamicFields = {
  childDynamicFields: DynamicField[];
  guestDynamicFields: DynamicField[];
  parentDynamicFields: DynamicField[];
  sessionDynamicFields: DynamicField[];
};

const defaultDynamicFieldsData: DynamicFields = {
  childDynamicFields: [],
  guestDynamicFields: [],
  parentDynamicFields: [],
  sessionDynamicFields: [],
};

export const DynamicFieldsContext = createContext<{
  dynamicFields: DynamicFields;
  fetchDynamicFields: () => void;
}>({
  dynamicFields: { ...defaultDynamicFieldsData },
  fetchDynamicFields: () => {},
});

type DynamicFieldsProviderProps = {
  children: ReactNode;
};

export const DynamicFieldsProvider = ({
  children,
}: DynamicFieldsProviderProps) => {
  const [dynamicFields, setDynamicFields] = useState<DynamicFields>({
    ...defaultDynamicFieldsData,
  });

  const fetchDynamicFields = async () => {
    const res = await DynamicFieldAPI.getFields();
    setDynamicFields({
      childDynamicFields: res.child_fields,
      guestDynamicFields: res.guest_fields,
      parentDynamicFields: res.parent_fields,
      sessionDynamicFields: res.session_fields,
    });
  };

  useEffect(() => {
    fetchDynamicFields();
  }, []);

  return (
    <DynamicFieldsContext.Provider
      value={{ dynamicFields, fetchDynamicFields }}
    >
      {children}
    </DynamicFieldsContext.Provider>
  );
};
