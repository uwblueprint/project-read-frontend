import React from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "../context/auth";

function NotFound() {
  const isAuthenticated = useAuth();
  return isAuthenticated ? <Redirect to="/" /> : <Redirect to="/login" />;
}

export default NotFound;
