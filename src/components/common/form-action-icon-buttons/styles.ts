import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  formActionButton: {
    borderRadius: 8,
    "& svg": {
      height: 20,
      width: 20,
    },
  },
}));

export default useStyles;
