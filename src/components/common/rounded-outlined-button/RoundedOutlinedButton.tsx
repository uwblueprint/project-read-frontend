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
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
};

const RoundedOutlinedButton = ({
  children,
  className = "",
  disabled = false,
  onClick = () => {},
}: Props) => {
  const classes = useStyles();
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      variant="outlined"
      className={`${classes.button} ${className}`}
    >
      {children}
    </Button>
  );
};

export default RoundedOutlinedButton;
