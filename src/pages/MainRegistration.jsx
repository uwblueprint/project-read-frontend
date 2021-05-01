import React, { useEffect, useState, useContext } from "react";
import { Typography } from "@material-ui/core";

import FamilyAPI from "../api/FamilyAPI";
import FamilyTable from "../components/families/FamilyTable";
import { AuthContext } from "../context/auth";

function MainRegistration() {
  const [families, setFamilies] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function fetchFamilies() {
      setFamilies(await FamilyAPI.getFamilies());
    }
    fetchFamilies();
  }, []);

  return (
    <>
      <Typography variant="h1">Main registration</Typography>
      <Typography variant="h2">
        Hi {user ? user.email : "anonymous user"}
      </Typography>
      <FamilyTable families={families} />
    </>
  );
}

export default MainRegistration;
