import React, { useState } from "react";

import FamilyAPI from "api/FamilyAPI";
import { FamilyListResponse } from "api/types";
import { DefaultField } from "types";

import {
  familyResponseToFamilyFormData,
  FamilyFormData,
} from "../family-form/utils";
import FamilySidebar from "./family-sidebar";
import FamilyTable from "./family-table";

type Props = {
  families: FamilyListResponse[];
  enrolmentFields: DefaultField[];
  shouldDisplayDynamicFields: boolean;
};

const FamilyList = ({
  families,
  enrolmentFields,
  shouldDisplayDynamicFields,
}: Props) => {
  const [selectedFamily, setSelectedFamily] = useState<FamilyFormData>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const onSelectFamily = async (id: number) => {
    const family = await FamilyAPI.getFamilyById(id);
    setSelectedFamily(familyResponseToFamilyFormData(family));
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <FamilyTable
        families={families}
        enrolmentFields={enrolmentFields}
        shouldDisplayDynamicFields={shouldDisplayDynamicFields}
        onSelectFamily={onSelectFamily}
      />
      {selectedFamily && (
        <FamilySidebar
          isOpen={isSidebarOpen}
          family={selectedFamily}
          onClose={handleCloseSidebar}
        />
      )}
    </>
  );
};

export default FamilyList;
