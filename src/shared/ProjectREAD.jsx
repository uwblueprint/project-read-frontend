import React from "react";
import { Redirect, Switch } from "react-router-dom";
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
          <Switch>
            <PrivateRoute exact path="/" component={MainRegistration} />
            <PrivateRoute
              exact
              path={[
                "/sessions",
                "/sessions/:sessionId",
                "/sessions/:sessionId/classes/:classId",
              ]}
              component={Sessions}
            />
            <Redirect to="/" />
          </Switch>
        </MuiPickersUtilsProvider>
      </Container>
    </DynamicFieldsProvider>
  );
}

export default ProjectREAD;
