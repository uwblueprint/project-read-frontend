import { Theme } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme: Theme) => ({
  activationButton: {
    fontWeight: 400,
    textDecoration: "underline",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  input: {
    fontSize: 14,
    height: 32,
    paddingBottom: 0,
    paddingTop: 0,
  },
  registerButton: {
    marginLeft: "20px",
  },
  roleSelect: {
    fontSize: 14,
    paddingBottom: 0,
    paddingTop: 0,
    height: 32,
  },
  roleSelectTabelCell: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  selectPlaceholder: {
    color: grey[500],
  },
  tableContainer: {
    marginTop: 32,
  },
}));

export default useStyles;
