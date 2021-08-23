import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  densePaddingY: {
    paddingBottom: 8,
    paddingTop: 8,
  },
  dialogHeading: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  dialogPaper: {
    height: 750,
  },
  dialogSubheading: {
    marginTop: theme.spacing(3),
  },
  expandButton: {
    transform: "rotate(0deg)",
    marginLeft: theme.spacing(1),
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandButtonOpen: {
    transform: "rotate(180deg)",
  },
  iconButtonTableCell: {
    padding: 0,
    width: 38,
  },
  nameColumn: {
    width: 200,
  },
  nameInput: {
    fontSize: 14,
  },
  noResultsTableCell: {
    textAlign: "center",
  },
  parentFirstNameTableCell: {
    display: "flex",
    alignItems: "center",
  },
  parentIcon: {
    paddingLeft: theme.spacing(1),
  },
  selectButton: {
    width: 100,
  },
  studentRow: {
    backgroundColor: theme.palette.background.default,
  },
  tableContainer: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    maxHeight: 250,
  },
}));

export default useStyles;
