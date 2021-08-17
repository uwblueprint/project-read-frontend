import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.palette.backgroundSecondary.default,
  },
  content: {
    color: theme.palette.text.secondary,
    fontSize: 12,
    fontWeight: 500,
  },
  editButton: {
    borderRadius: 8,
    height: 40,
    width: 40,
    "& svg": {
      height: 20,
      width: 20,
    },
  },
  formActionButton: {
    borderRadius: 8,
    height: 32,
    width: 32,
    "& svg": {
      height: 20,
      width: 20,
    },
  },
  input: {
    backgroundColor: theme.palette.background.paper,
    fontSize: 14,
    paddingBottom: 0,
    paddingTop: 0,
    height: 32,
  },
  menuItem: {
    fontSize: 14,
    height: 32,
  },
  select: {
    paddingBottom: 8,
    paddingTop: 8,
  },
  title: {
    fontWeight: 700,
  },
}));

export default useStyles;
