import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import FamilyAPI, { FamilyListResponse } from "../api/FamilyAPI";
import FamilyTable from "../components/families/FamilyTable";
import { DefaultFields } from "../constants/DefaultFields";

const MainRegistration = () => {
  const [families, setFamilies] = useState<FamilyListResponse[]>([]);

  useEffect(() => {
    async function fetchFamilies() {
      setFamilies(await FamilyAPI.getFamilies());
    }
    fetchFamilies();
  }, []);

  return (
    <>
      <Typography variant="h1">Main registration</Typography>
      <FamilyTable
        families={families}
        enrolmentFields={[
          DefaultFields.ENROLLED,
          DefaultFields.CURRENT_CLASS,
          DefaultFields.STATUS,
        ]}
        shouldDisplayDynamicFields
      />
    </>
  );
};

export default MainRegistration;
