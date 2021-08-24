import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles<Theme>((theme) => ({
  label: {
    fontSize: 12,
    marginRight: 8,
  },
  labelIcon: {
    color: theme.palette.text.secondary,
    marginRight: 8,
    height: 20,
    width: 20,
  },
}));

export default useStyles;
