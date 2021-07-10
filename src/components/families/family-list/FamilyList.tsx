import React, { useState } from "react";

import FamilyAPI from "api/FamilyAPI";
import { FamilyDetailResponse, FamilyListResponse } from "api/types";
import { DefaultField } from "types";

import FamilyDetailsSidebar from "./FamilyDetailsSidebar";
import FamilyTable from "./FamilyTable";

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
        <FamilyDetailsSidebar
          isOpen={isSidebarOpen}
          family={selectedFamily}
          handleClose={handleCloseSidebar}
        />
      )}
    </>
  );
};

export default FamilyList;
