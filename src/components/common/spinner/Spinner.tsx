import React from "react";

import { Box } from "@material-ui/core";
import { FadeLoader } from "react-spinners";

import theme from "theme";

import useStyles from "./styles";

const Spinner = () => {
  const classes = useStyles();
  return (
    <Box
      position="sticky"
      height={60}
      width={60}
      top="50%"
      left="50%"
      className={classes.spinner}
    >
      <FadeLoader color={theme.palette.primary.main} />
    </Box>
  );
};

export default Spinner;
