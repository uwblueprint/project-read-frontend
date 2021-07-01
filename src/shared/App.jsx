import React from "react";
import {
  Redirect,
  Route,
  Switch,
  BrowserRouter as Router,
} from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";

import { AuthProvider } from "../context/auth";
import Login from "../pages/Login";
import ProjectREAD from "./ProjectREAD";
import PrivateRoute from "./PrivateRoute";
import theme from "../theme";

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
