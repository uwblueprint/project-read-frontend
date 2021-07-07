import React, { useEffect, useState, createContext, ReactNode } from "react";

import DynamicFieldAPI from "api/DynamicFieldAPI";
import { DynamicField } from "types";

type DynamicFields = {
  childDynamicFields: DynamicField[];
  guestDynamicFields: DynamicField[];
  parentDynamicFields: DynamicField[];
};

const defaultDynamicFieldsData: DynamicFields = {
  childDynamicFields: [],
  guestDynamicFields: [],
  parentDynamicFields: [],
};

export const DynamicFieldsContext = createContext<DynamicFields>({
  ...defaultDynamicFieldsData,
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

  useEffect(() => {
    async function fetchDynamicFields() {
      const res = await DynamicFieldAPI.getFields();
      setDynamicFields({
        childDynamicFields: res.child_fields,
        guestDynamicFields: res.guest_fields,
        parentDynamicFields: res.parent_fields,
      });
    }
    fetchDynamicFields();
  }, []);

  return (
    <DynamicFieldsContext.Provider value={dynamicFields}>
      {children}
    </DynamicFieldsContext.Provider>
  );
};
