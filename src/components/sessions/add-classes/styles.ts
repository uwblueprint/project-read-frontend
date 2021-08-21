import { Theme } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles<Theme>(() => ({
  addButton: {
    marginBottom: 48,
    marginLeft: 32,
    marginTop: 10,
    paddingLeft: 12,
    paddingRight: 12,
  },
  addButtonIcon: {
    marginRight: 8,
  },
  deleteButton: {
    height: 16,
    width: 16,
  },
  rowContainer: {
    alignItems: "center",
    display: "flex",
    height: 56,
  },
  selectPlaceholder: {
    color: grey[500],
  },
}));

export default useStyles;
