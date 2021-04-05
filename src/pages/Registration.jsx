import React, { useEffect, useState, useContext } from "react";
import { Typography } from "@material-ui/core";

import FamilyAPI from "../api/FamilyAPI";
import RegistrationTable from "../components/registration/RegistrationTable";
import { AuthContext } from "../context/auth";

function Registration() {
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
      <RegistrationTable families={families} />
    </>
  );
}

export default Registration;
