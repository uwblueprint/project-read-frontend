import React, { ReactNode } from "react";

import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.palette.backgroundSecondary.default,
  },
  content: {
    "& .MuiTypography-body2": {
      color: theme.palette.text.secondary,
      fontSize: 12,
      fontWeight: 500,
    },
  },
  title: {
    "& .MuiTypography-body2": {
      fontWeight: 700,
    },
  },
}));

type Props = {
  title: ReactNode;
  content: ReactNode;
};

const FamilySidebarCard = ({ title, content }: Props) => {
  const classes = useStyles();
  return (
    <Box
      className={classes.card}
      borderRadius={4}
      marginBottom={1.5}
      paddingX={2}
      paddingY={1.5}
    >
      <div className={classes.title}>{title}</div>
      <div className={classes.content}>{content}</div>
    </Box>
  );
};

export default FamilySidebarCard;
