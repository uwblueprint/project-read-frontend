import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const denseStyles = (theme: Theme) => ({
  checkbox: {
    "& svg": {
      height: 20,
      width: 20,
    },
  },
  chip: {
    height: 22,
  },
  input: {
    backgroundColor: theme.palette.background.paper,
    fontSize: 14,
    paddingBottom: 0,
    paddingTop: 0,
    height: 32,
  },
  label: {
    fontSize: 14,
  },
  menuItem: {
    fontSize: 14,
    height: 32,
  },
  select: {
    paddingBottom: 8,
    paddingTop: 8,
  },
});

const useStyles = makeStyles<Theme, { dense: boolean }>((theme) => ({
  checkbox: ({ dense }) => ({
    marginRight: 8,
    padding: 0,
    ...(dense && denseStyles(theme).checkbox),
  }),
  chip: ({ dense }) => ({
    marginRight: 4,
    ...(dense && denseStyles(theme).chip),
  }),
  input: ({ dense }) => ({
    height: 56,
    ...(dense && denseStyles(theme).input),
  }),
  label: ({ dense }) => ({
    ...(dense && denseStyles(theme).label),
  }),
  menuItem: ({ dense }) => ({
    ...(dense && denseStyles(theme).menuItem),
  }),
  select: ({ dense }) => ({
    ...(dense && denseStyles(theme).select),
  }),
  placeholder: {
    color: "rgba(0, 0, 0, 0.38)",
  },
}));

export default useStyles;
