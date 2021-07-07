import React, { useEffect, useState } from "react";

import { Typography } from "@material-ui/core";

import FamilyAPI from "../api/FamilyAPI";
import { FamilyListResponse } from "../api/types";
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
          DefaultFields.CURRENT_PREFERRED_CLASS,
          DefaultFields.IS_ENROLLED,
          DefaultFields.CURRENT_CLASS,
        ]}
        shouldDisplayDynamicFields
      />
    </>
  );
};

export default MainRegistration;
