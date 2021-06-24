import React from "react";
import { Container } from "@material-ui/core";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

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
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <PrivateRoute exact path="/" component={MainRegistration} />
          <PrivateRoute exact path="/sessions" component={Sessions} />
        </MuiPickersUtilsProvider>
      </Container>
    </DynamicFieldsProvider>
  );
}

export default ProjectREAD;
