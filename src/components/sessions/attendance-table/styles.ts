import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  button: {
    order: -1,
    height: 36,
    marginTop: 5,
    marginRight: 15,
    textTransform: "none",
  },
  buttonIcon: {
    height: 20,
    width: 20,
    marginLeft: 8,
  },
}));

export default useStyles;
