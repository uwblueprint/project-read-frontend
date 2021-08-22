import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  content: {
    "& .MuiTypography-body2": {
      color: theme.palette.text.secondary,
      fontSize: 12,
      fontWeight: 500,
      marginTop: 4,
      marginBottom: 4,
    },
  },
  divider: {
    background: theme.palette.text.secondary,
    margin: theme.spacing(1),
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
  headingContainer: {
    width: 100,
  },
  statusChip: {
    height: 26,
  },
}));

export default useStyles;
