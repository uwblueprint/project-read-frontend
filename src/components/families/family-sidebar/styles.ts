import { makeStyles } from "@material-ui/core/styles";

const DRAWER_WIDTH = 416;

const useStyles = makeStyles((theme) => ({
  actionButton: {
    backgroundColor: theme.palette.backgroundSecondary.default,
    borderRadius: 8,
    height: 40,
    width: 40,
  },
  actionButtonIcon: {
    height: 20,
    width: 20,
  },
  close: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    marginTop: 6,
  },
  drawer: {
    width: DRAWER_WIDTH,
  },
  drawerPaper: {
    backgroundColor: theme.palette.backgroundSecondary.paper,
    borderLeft: "none",
    height: "calc(100% - 64px)",
    marginTop: 64,
    width: DRAWER_WIDTH,
  },
  formActionRow: {
    backgroundColor: theme.palette.backgroundSecondary.paper,
    boxShadow: "rgb(0 0 0 / 12%) 8px 0px 8px 0px",
    zIndex: theme.zIndex.appBar + 1,
    width: DRAWER_WIDTH,
  },
  heading: {
    fontWeight: 700,
    fontSize: 18,
    paddingBottom: 20,
    paddingTop: 20,
  },
  notes: {
    alignItems: "baseline",
    backgroundColor: theme.palette.backgroundSecondary.default,
    borderRadius: 4,
    fontSize: 14,
    height: 150,
    overflowY: "scroll",
    padding: 16,
  },
  notesLabel: {
    display: "none",
  },
  submitButton: {
    marginLeft: 12,
    marginRight: 24,
  },
}));

export default useStyles;
