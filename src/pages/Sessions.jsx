import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";

import SessionAPI from "../api/SessionAPI";

function Sessions() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    async function fetchSessions() {
      setSessions(await SessionAPI.getSessions());
    }
    fetchSessions();
  }, []);

  return (
    <>
      <Typography variant="h1">Sessions</Typography>
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
    </>
  );
}

export default Sessions;
