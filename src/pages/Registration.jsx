import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";

import FamilyAPI from "../api/FamilyAPI";
import SessionAPI from "../api/SessionAPI";
import RegistrationTable from "../components/registration/RegistrationTable";

function Registration() {
  const [families, setFamilies] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    async function fetchFamilies() {
      setFamilies(await FamilyAPI.getFamilies());
    }
    async function fetchSessions() {
      setSessions(await SessionAPI.getSessions());
    }
    fetchFamilies();
    fetchSessions();
  }, []);

  return (
    <>
      <Typography variant="h1">Main registration</Typography>
      {sessions.length ? (
        <ul>
          {sessions.map((session) => (
            <li key={session.id}>
              <Typography variant="body1">
                {session.id} - {session.season} {session.year}
              </Typography>
            </li>
          ))}
        </ul>
      ) : (
        <p>No sessions found</p>
      )}
      <RegistrationTable data={families} />
    </>
  );
}

export default Registration;
