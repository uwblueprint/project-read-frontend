import React from "react";

import MomentUtils from "@date-io/moment";
import { Container } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Redirect, Switch } from "react-router-dom";

import { DynamicFieldsProvider } from "context/DynamicFieldsContext";
import CreateSession from "pages/create-session";
import MainRegistration from "pages/MainRegistration";
import Sessions from "pages/Sessions";

import Navbar from "./Navbar";
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
              path="/sessions/create"
              component={CreateSession}
            />
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
