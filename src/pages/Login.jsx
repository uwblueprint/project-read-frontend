import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import firebase from "firebase";
import { FirebaseAuth } from "react-firebaseui";

import { AuthContext } from "../context/auth";

function Login(props) {
  const { user } = useContext(AuthContext);
  const referer = { ...props }.location.state
    ? { ...props }.location.state.referer
    : { pathname: "/" };

  const uiConfig = {
    signInFlow: "popup",
    signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
    callbacks: {
      signInSuccess: () => false,
    },
  };

  return (
    <div>
      {user ? (
        <Redirect to={referer} />
      ) : (
        <div>
          <p>Please Sign In</p>
          <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </div>
      )}
    </div>
  );
}

export default Login;
