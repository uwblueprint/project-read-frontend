/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { Container } from "@material-ui/core";
import { AuthContext } from "./context/auth";

function PrivateRoute({ component: Component }) {
  const { user } = useContext(AuthContext);

  return (
    <Route
      render={(props) =>
        user ? (
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
