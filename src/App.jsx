import { Route, Switch, BrowserRouter as Router } from "react-router-dom";

import React from "react";
import { AuthContext } from "./context/auth";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import Registrations from "./pages/Registrations";

function App() {
  return (
    <AuthContext.Provider value={false}>
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/" component={Registrations} />
          <Route exact path="*" component={NotFound} />
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
