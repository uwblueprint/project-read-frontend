import React from "react";
import { Container } from "@material-ui/core";

import { DynamicFieldsProvider } from "../context/DynamicFieldsContext";
import Navbar from "../components/Navbar";
import MainRegistration from "../pages/MainRegistration";
import Sessions from "../pages/Sessions";
import PrivateRoute from "./PrivateRoute";

function ProjectREAD() {
  return (
    <DynamicFieldsProvider>
      <Container maxWidth={false}>
        <Navbar />
        <PrivateRoute exact path="/" component={MainRegistration} />
        <PrivateRoute exact path="/sessions" component={Sessions} />
      </Container>
    </DynamicFieldsProvider>
  );
}

export default ProjectREAD;
