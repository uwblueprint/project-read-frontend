import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";

import { AuthContext } from "../context/auth";

function PrivateRoute({ component: Component, ...rest }) {
  const { user } = useContext(AuthContext);

  return (
    <Route
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      render={({ location }) =>
        user ? (
          <Component />
        ) : (
          <Redirect to={{ pathname: "/login", state: { referer: location } }} />
        )
      }
    />
  );
}

PrivateRoute.defaultProps = {
  location: null,
};

PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  location: PropTypes.shape({ pathname: PropTypes.string }),
};

export default PrivateRoute;
