import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import React from "react";
import { AuthContext } from "./context/auth";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import Registration from "./pages/Registration";

const theme = createMuiTheme({
  typography: {
    h1: {
      fontSize: 36,
      fontWeight: "bold",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={false}>
        <Router>
          <Switch>
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/" component={Registration} />
            <Route exact path="*" component={NotFound} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
