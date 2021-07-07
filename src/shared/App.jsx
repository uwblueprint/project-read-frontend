import React from "react";

import { ThemeProvider } from "@material-ui/core/styles";
import {
  Redirect,
  Route,
  Switch,
  BrowserRouter as Router,
} from "react-router-dom";

import { AuthProvider } from "context/auth";
import Login from "pages/Login";
import theme from "theme";

import PrivateRoute from "./PrivateRoute";
import ProjectREAD from "./ProjectREAD";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Switch>
            <Route exact path="/login" component={Login} />
            <PrivateRoute component={ProjectREAD} />
            <Redirect to="/" />
          </Switch>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
