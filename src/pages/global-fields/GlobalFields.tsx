import React from "react";

import { Typography } from "@material-ui/core";

import FormEditor from "components/form-editor";

const GlobalFields = () => (
  <>
    <Typography variant="h1">Configure the global questions</Typography>
    <FormEditor isReadOnly={false} />
  </>
);

export default GlobalFields;
