import React, { useEffect, useState } from "react";

import { Typography } from "@material-ui/core";

import EnrolmentAPI from "api/EnrolmentAPI";
import FamilyAPI from "api/FamilyAPI";
import {
  EnrolmentRequest,
  FamilyDetailResponse,
  FamilyListResponse,
  FamilyRequest,
} from "api/types";
import SpinnerOverlay from "components/common/spinner-overlay";
import FamilySidebar from "components/families/family-sidebar";
import FamilyTable from "components/families/family-table";
import DefaultFields from "constants/DefaultFields";

const MainRegistration = () => {
  const [families, setFamilies] = useState<FamilyListResponse[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [
    selectedFamily,
    setSelectedFamily,
  ] = useState<FamilyDetailResponse | null>(null);
  const [isLoadingFamilies, setIsLoadingFamilies] = useState(true);

  const resetFamilies = async () => {
    setIsLoadingFamilies(true);
    setFamilies(await FamilyAPI.getFamilies());
    setIsLoadingFamilies(false);
  };

  useEffect(() => {
    resetFamilies();
  }, []);

  const onSelectFamily = async (id: number) => {
    const family = await FamilyAPI.getFamilyById(id);
    setSelectedFamily(family);
    setIsSidebarOpen(true);
  };

  const onSaveFamily = async (data: FamilyRequest) => {
    if (selectedFamily === null) {
      return;
    }
    setSelectedFamily(
      await FamilyAPI.putFamily({ ...data, id: selectedFamily.id })
    );
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
      {isLoadingFamilies && <SpinnerOverlay />}
      <Typography variant="h1">Main registration</Typography>
      <FamilyTable
        families={families}
        enrolmentFields={[
          DefaultFields.PREFERRED_CLASS,
          DefaultFields.SESSION,
          DefaultFields.ENROLLED_CLASS,
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
          onSaveFamily={onSaveFamily}
        />
      )}
    </>
  );
};

export default MainRegistration;
