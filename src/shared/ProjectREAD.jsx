import React from "react";
import { Container } from "@material-ui/core";

import { FieldsProvider } from "../context/fields";
import Navbar from "../components/Navbar";
import Registration from "../pages/Registration";
import Sessions from "../pages/Sessions";
import PrivateRoute from "./PrivateRoute";

function ProjectREAD() {
  return (
    <FieldsProvider>
      <Container maxWidth={false}>
        <Navbar />
        <PrivateRoute exact path="/" component={Registration} />
        <PrivateRoute exact path="/sessions" component={Sessions} />
      </Container>
    </FieldsProvider>
  );
}

export default ProjectREAD;
