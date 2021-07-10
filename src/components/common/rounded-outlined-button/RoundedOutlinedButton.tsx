import React, { ReactNode } from "react";

import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  button: {
    borderRadius: 18,
    paddingLeft: 24,
    paddingRight: 24,
  },
}));

type Props = {
  children: ReactNode;
  onClick: () => void;
};

const RoundedOutlinedButton = ({ children, onClick }: Props) => {
  const classes = useStyles();
  return (
    <Button onClick={onClick} variant="outlined" className={classes.button}>
      {children}
    </Button>
  );
};

export default RoundedOutlinedButton;
