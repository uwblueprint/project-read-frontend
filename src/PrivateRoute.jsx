/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { Container } from "@material-ui/core";

import { AuthContext } from "./context/auth";
import { FieldsProvider } from "./context/fields";
import Navbar from "./components/Navbar";

function PrivateRoute({ component: Component }) {
  const { user } = useContext(AuthContext);

  return (
    <Route
      render={(props) =>
        user ? (
          <FieldsProvider>
            <Navbar />
            <Container maxWidth={false}>
              <Component {...props} />
            </Container>
          </FieldsProvider>
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { referer: props.location } }}
          />
        )
      }
    />
  );
}

PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  location: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default PrivateRoute;
