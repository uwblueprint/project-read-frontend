import React, { ReactNode } from "react";

import { Box } from "@material-ui/core";

import useStyles from "./styles";

type Props = {
  children: ReactNode;
};

const SidebarCard = ({ children }: Props) => {
  const classes = useStyles();
  return (
    <Box
      className={classes.card}
      borderRadius={4}
      marginBottom={1.5}
      paddingX={2}
      paddingY={1.5}
    >
      {children}
    </Box>
  );
};

export default SidebarCard;
