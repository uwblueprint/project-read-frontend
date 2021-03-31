import React, { useEffect, useState, useContext } from "react";
import { Typography } from "@material-ui/core";
import { AuthContext } from "../context/auth";

import FamilyAPI from "../api/FamilyAPI";
import SessionAPI from "../api/SessionAPI";
import RegistrationTable from "../components/registration/RegistrationTable";

function Registration() {
  const [families, setFamilies] = useState([]);
  const [sessions, setSessions] = useState([]);
  const { user } = useContext(AuthContext);

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
      <Typography variant="h2">
        Hi {user ? user.email : "anonymous user"}
      </Typography>
      <Typography variant="h2">Sessions</Typography>
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
