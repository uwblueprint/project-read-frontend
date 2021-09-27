import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  button: {
    alignSelf: "center",
    order: -1,
    height: 36,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    textTransform: "none",
  },
  buttonIcon: {
    height: 20,
    width: 20,
    marginLeft: 8,
  },
}));

export default useStyles;
