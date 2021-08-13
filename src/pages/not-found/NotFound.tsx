import React from "react";

import { Button } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { ErrorOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";

const NotFound = () => (
  <Box
    textAlign="center"
    position="absolute"
    top="50%"
    left="50%"
    style={{ transform: "translate(-50%, -50%)" }}
  >
    <Box>
      <ErrorOutline fontSize="large" />
    </Box>
    <h1>Oh no! This page doesn&apos;t exist.</h1>
    <Link to="/" style={{ textDecoration: "none" }}>
      <Button color="primary">Return to all registrations</Button>
    </Link>
  </Box>
);

export default NotFound;
