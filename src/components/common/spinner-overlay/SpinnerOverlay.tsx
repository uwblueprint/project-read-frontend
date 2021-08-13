import React from "react";

import { Backdrop } from "@material-ui/core";
import { FadeLoader } from "react-spinners";

import theme from "theme";

import useStyles from "./styles";

const SpinnerOverlay = () => {
  const classes = useStyles();
  return (
    <Backdrop open className={classes.spinnerOverlay}>
      <FadeLoader color={theme.palette.primary.main} />
    </Backdrop>
  );
};

export default SpinnerOverlay;
