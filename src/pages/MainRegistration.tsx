import React, { useEffect, useState } from "react";

import { Typography } from "@material-ui/core";

import EnrolmentAPI from "api/EnrolmentAPI";
import FamilyAPI from "api/FamilyAPI";
import {
  EnrolmentRequest,
  FamilyDetailResponse,
  FamilyListResponse,
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

  const resetFamilies = async () => setFamilies(await FamilyAPI.getFamilies());

  useEffect(() => {
    resetFamilies();
  }, []);

  const onSelectFamily = async (id: number) => {
    const family = await FamilyAPI.getFamilyById(id);
    setSelectedFamily(family);
    setIsSidebarOpen(true);
  };

  const onEditFamily = async () => {
    if (selectedFamily === null) {
      return;
    }
    resetFamilies();
  };

  const onEditFamilyCurrentEnrolment = async (data: EnrolmentRequest) => {
    if (selectedFamily === null || selectedFamily.current_enrolment === null) {
      return;
    }
    setSelectedFamily({
      ...selectedFamily,
      current_enrolment: await EnrolmentAPI.putEnrolment(data),
    });
    resetFamilies();
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
          onEditCurrentEnrolment={onEditFamilyCurrentEnrolment}
          onEditFamily={onEditFamily}
        />
      )}
    </>
  );
};

export default MainRegistration;
