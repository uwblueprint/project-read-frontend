import React from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";

import { AuthProvider } from "./context/auth";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Registration from "./pages/Registration";
import Sessions from "./pages/Sessions";
import PrivateRoute from "./PrivateRoute";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Switch>
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/" component={Registration} />
            <PrivateRoute exact path="/sessions" component={Sessions} />
            <Route exact path="*" component={NotFound} />
          </Switch>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
