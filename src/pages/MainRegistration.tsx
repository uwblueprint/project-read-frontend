import React, { useEffect, useState } from "react";

import { Typography } from "@material-ui/core";

import FamilyAPI from "api/FamilyAPI";
import {
  FamilyDetailResponse,
  FamilyListResponse,
  FamilyRequest,
} from "api/types";
import FamilySidebar from "components/families/family-sidebar";
import FamilyTable from "components/families/family-table";
import { DefaultFields } from "constants/DefaultFields";

const MainRegistration = () => {
  const [families, setFamilies] = useState<FamilyListResponse[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [
    selectedFamily,
    setSelectedFamily,
  ] = useState<FamilyDetailResponse | null>(null);

  useEffect(() => {
    async function fetchFamilies() {
      setFamilies(await FamilyAPI.getFamilies());
    }
    fetchFamilies();
  }, []);

  const onSelectFamily = async (id: number) => {
    const family = await FamilyAPI.getFamilyById(id);
    setSelectedFamily(family);
    setIsSidebarOpen(true);
  };

  const onEditFamily = async (data: FamilyRequest) => {
    if (selectedFamily === null) {
      return;
    }
    console.log(selectedFamily.id);
    console.log(data);
  };

  return (
    <>
      <Typography variant="h1">Main registration</Typography>
      <FamilyTable
        families={families}
        enrolmentFields={[
          DefaultFields.CURRENT_PREFERRED_CLASS,
          DefaultFields.IS_ENROLLED,
          DefaultFields.CURRENT_CLASS,
        ]}
        shouldDisplayDynamicFields
        onSelectFamily={onSelectFamily}
      />
      {selectedFamily && (
        <FamilySidebar
          isOpen={isSidebarOpen}
          family={selectedFamily}
          onClose={() => setIsSidebarOpen(false)}
          onEditFamily={onEditFamily}
        />
      )}
    </>
  );
};

export default MainRegistration;
