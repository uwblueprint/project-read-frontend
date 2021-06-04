import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import FamilyAPI, { FamilyListResponse } from "../api/FamilyAPI";
import FamilyTable from "../components/families/FamilyTable";

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
      <FamilyTable families={families} />
    </>
  );
};

export default MainRegistration;
