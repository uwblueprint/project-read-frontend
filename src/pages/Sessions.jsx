import React, { useEffect, useState } from "react";
import { Button, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";

import SessionAPI from "../api/SessionAPI";
import RegistrationDialog from "../components/registration/RegistrationDialog";

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [displayRegDialog, setDisplayRegDialog] = useState(false);

  useEffect(() => {
    async function fetchSessions() {
      setSessions(await SessionAPI.getSessions());
    }
    fetchSessions();
  }, []);

  const handleOpenFormDialog = () => {
    setDisplayRegDialog(true);
  };

  const handleCloseFormDialog = () => {
    setDisplayRegDialog(false);
  };

  return (
    <>
      <Typography variant="h1">Sessions</Typography>
      <Button variant="outlined" onClick={handleOpenFormDialog}>
        New registrant
        <Add />
      </Button>
      <RegistrationDialog
        open={displayRegDialog}
        onClose={handleCloseFormDialog}
      />
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
