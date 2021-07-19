import React, { useState } from "react";

import FamilyAPI from "api/FamilyAPI";
import { FamilyDetailResponse, FamilyListResponse } from "api/types";
import { DefaultField } from "types";

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
  const [
    selectedFamily,
    setSelectedFamily,
  ] = useState<FamilyDetailResponse | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const onSelectFamily = async (id: number) => {
    setSelectedFamily(await FamilyAPI.getFamilyById(id));
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
