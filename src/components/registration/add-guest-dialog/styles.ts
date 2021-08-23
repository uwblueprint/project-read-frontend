import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
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
  selectButtonTableCell: {
    paddingBottom: 8,
    paddingTop: 8,
  },
  studentRow: {
    backgroundColor: theme.palette.background.default,
  },
  tableContainer: {
    maxHeight: 250,
  },
}));

export default useStyles;
