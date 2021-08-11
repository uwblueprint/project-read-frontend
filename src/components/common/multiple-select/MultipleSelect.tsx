import React from "react";

import { Checkbox, Chip, MenuItem, Select } from "@material-ui/core";

import useStyles from "./styles";

type Props = {
  compact: boolean;
  dense: boolean;
  id: string;
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
};

const MultipleSelect = ({
  compact,
  dense,
  id,
  label,
  onChange,
  options,
  value,
}: Props) => {
  const classes = useStyles({ dense });
  const values = value.length ? value.split("\n") : [];
  const dynamicOptions = values.filter((val) => val && !options.includes(val));

  return (
    <Select
      aria-label={label}
      className={classes.input}
      displayEmpty
      fullWidth
      inputProps={{
        "data-testid": id,
        className: classes.select,
      }}
      labelId={id}
      multiple
      onChange={(e) => onChange((e.target.value as string[]).join("\n"))}
      renderValue={() =>
        values.length ? (
          values.map((valueText) => (
            <Chip key={valueText} label={valueText} className={classes.chip} />
          ))
        ) : (
          <span className={classes.placeholder}>
            {compact ? label : "Select"}
          </span>
        )
      }
      value={values}
      variant="outlined"
    >
      {dynamicOptions.concat(options).map((option) => (
        <MenuItem key={option} value={option} className={classes.menuItem}>
          <Checkbox
            checked={values.includes(option)}
            color="primary"
            className={classes.checkbox}
          />
          {option}
        </MenuItem>
      ))}
    </Select>
  );
};

export default MultipleSelect;
