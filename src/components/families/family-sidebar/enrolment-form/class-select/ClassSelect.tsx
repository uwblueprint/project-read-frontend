import React from "react";

import { Select, InputBase, MenuItem, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { ClassListResponse } from "api/types";

const baseId = "enrolment-select";

const useStyles = makeStyles((theme: Theme) => ({
  input: {
    backgroundColor: theme.palette.backgroundSecondary.default,
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14,
    height: 40,
    marginBottom: 2,
    marginTop: 2,
  },
  menuItem: {
    fontSize: 14,
    height: 40,
  },
  select: {
    borderRadius: 4,
    paddingBottom: 4,
    paddingTop: 4,
    paddingLeft: 16,
    paddingRight: 32,
    width: "100%",
  },
}));

type Props = {
  id: string;
  onChange: (id: number) => void;
  options: ClassListResponse[];
  value: number | null;
};

const ClassSelect = ({ id, onChange, options, value }: Props) => {
  const classes = useStyles();
  return (
    <Select
      displayEmpty
      fullWidth
      input={<InputBase className={classes.input} />}
      labelId={`${baseId}-${id}`}
      onChange={(e) => onChange!(e.target.value as number)}
      SelectDisplayProps={{
        className: classes.select,
      }}
      value={value || ""}
    >
      <MenuItem className={classes.menuItem} value="">
        None
      </MenuItem>
      {options?.map((option) => (
        <MenuItem className={classes.menuItem} value={option.id}>
          {option.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default ClassSelect;
