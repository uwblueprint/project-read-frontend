import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const denseStyles = (theme: Theme) => ({
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
  multipleSelectValueChip: {
    height: 22,
  },
  select: {
    paddingBottom: 8,
    paddingTop: 8,
  },
});

const useStyles = makeStyles<Theme, { dense: boolean | undefined }>(
  (theme) => ({
    input: ({ dense }) => ({
      height: 56,
      ...(dense && denseStyles(theme).input),
    }),
    label: ({ dense }) => (dense ? denseStyles(theme).label : {}),
    menuItem: ({ dense }) => (dense ? denseStyles(theme).menuItem : {}),
    multipleSelectCheckbox: {
      marginRight: 8,
      padding: 0,
      "& svg": {
        height: 20,
        width: 20,
      },
    },
    multipleSelectValueChip: ({ dense }) => ({
      marginRight: 4,
      ...(dense && denseStyles(theme).multipleSelectValueChip),
    }),
    select: ({ dense }) => ({
      ...(dense && denseStyles(theme).select),
    }),
    selectPlaceholder: {
      color: "rgba(0, 0, 0, 0.38)",
    },
  })
);

export default useStyles;
