import React from "react";
import { Container } from "@material-ui/core";

import { FieldsProvider } from "../context/fields";
import Navbar from "../components/Navbar";
import MainRegistration from "../pages/MainRegistration";
import Sessions from "../pages/Sessions";
import PrivateRoute from "./PrivateRoute";

function ProjectREAD() {
  return (
    <FieldsProvider>
      <Container maxWidth={false}>
        <Navbar />
        <PrivateRoute exact path="/" component={MainRegistration} />
        <PrivateRoute exact path="/sessions" component={Sessions} />
      </Container>
    </FieldsProvider>
  );
}

export default ProjectREAD;
