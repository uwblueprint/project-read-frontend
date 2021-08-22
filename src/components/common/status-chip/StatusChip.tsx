import React from "react";

import { Chip, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import EnrolmentStatus from "constants/EnrolmentStatus";

const StatusColourMap = new Map([
  [EnrolmentStatus.CLASS_ALLOCATED, "#A2D185"],
  [EnrolmentStatus.COMPLETED, "#80ADEF"],
  [EnrolmentStatus.DROP_OUT, "#C1A0F5"],
  [EnrolmentStatus.NO_SHOW, "#FAE28D"],
  [EnrolmentStatus.REGISTERED, "#FFBF60"],
  [EnrolmentStatus.SIGNED_UP, "#FF928B"],
  [EnrolmentStatus.UNASSIGNED, "#E0E0E0"],
  [EnrolmentStatus.WAITLISTED, "#E693E8"],
]);

type Props = {
  className?: string;
  status: EnrolmentStatus;
};

const defaultProps = {
  className: "",
};

const useStyles = makeStyles<Theme, Props>(() => ({
  chip: {
    backgroundColor: ({ status }) => StatusColourMap.get(status),
    color: "rgba(0, 0, 0, 0.5)",
    fontSize: ({ status }) =>
      status === EnrolmentStatus.CLASS_ALLOCATED ? 12 : 14,
    fontWeight: 500,
    width: 100,

    "& .MuiChip-label": {
      paddingLeft: 6,
      paddingRight: 6,
    },
  },
}));

const StatusChip = ({ className, status }: Props) => {
  const classes = useStyles({ status });
  return <Chip label={status} className={`${classes.chip} ${className}`} />;
};

StatusChip.defaultProps = defaultProps;

export default StatusChip;
