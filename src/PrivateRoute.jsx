/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { Container } from "@material-ui/core";

import { useAuth } from "./context/auth";

function PrivateRoute({ component: Component }) {
  const isAuthenticated = useAuth();

  return (
    <Route
      render={(props) =>
        isAuthenticated ? (
          <Container>
            <Component {...props} />
          </Container>
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}

PrivateRoute.propTypes = {
  component: PropTypes.node.isRequired,
};

export default PrivateRoute;
