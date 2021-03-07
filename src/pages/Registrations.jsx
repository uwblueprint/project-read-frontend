import React, { useEffect, useState } from "react";
import FamilyAPI from "../api/FamilyAPI";
import SessionAPI from "../api/SessionAPI";

function Registrations() {
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
    <div>
      <h1>Main Registration</h1>
      <h2>Sessions</h2>
      {sessions.length ? (
        <ul>
          {sessions.map((session) => (
            <li key={session.id}>
              {session.id} - {session.season} {session.year}
            </li>
          ))}
        </ul>
      ) : (
        <p>No sessions found</p>
      )}
      <h2>Families</h2>
      {families.length ? (
        <ul>
          {families.map((family) => (
            <li key={family.id}>
              {family.id} - {family.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>No families found</p>
      )}
    </div>
  );
}

export default Registrations;
