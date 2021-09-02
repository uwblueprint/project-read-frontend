import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(() => ({
  activationButton: {
    fontWeight: 400,
    textDecoration: "underline",
    "&:hover": {
      textDecoration: "underline",
    },
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
  tableContainer: {
    marginTop: 32,
  },
}));

export default useStyles;
