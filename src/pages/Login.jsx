import React, { useContext } from "react";

import firebase from "firebase";
import { FirebaseAuth } from "react-firebaseui";
import { Redirect } from "react-router-dom";

import { AuthContext } from "context/auth";

function Login(props) {
  const { user } = useContext(AuthContext);
  const referer = { ...props }.location.state
    ? { ...props }.location.state.referer
    : "/";

  const uiConfig = {
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
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
