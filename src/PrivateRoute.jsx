import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "./context/auth";

function PrivateRoute({ component: Component }) {
  const isAuthenticated = useAuth();

  return (
    <Route
      render={(props) =>
        // eslint-disable-next-line react/jsx-props-no-spreading
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

PrivateRoute.propTypes = {
  component: PropTypes.node.isRequired,
};

export default PrivateRoute;
