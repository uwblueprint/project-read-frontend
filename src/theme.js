import { createMuiTheme } from "@material-ui/core/styles";

const defaultTheme = createMuiTheme();

const theme = createMuiTheme({
  palette: {
    type: "light",
  },
  overrides: {
    MuiContainer: {
      root: {
        paddingTop: 106,
        paddingBottom: 54,
        [defaultTheme.breakpoints.up("lg")]: {
          paddingLeft: 54,
          paddingRight: 54,
        },
      },
    },
    MuiAppBar: {
      root: {
        boxShadow: "none",
      },
    },
    MuiButton: {
      root: {
        textTransform: "none",
      },
    },
    MuiInputLabel: {
      root: {
        fontSize: 16,
        fontWeight: 700,
        position: "relative",
        transform: "none",
        width: 150,
      },
    },
  },
  typography: {
    h1: {
      fontSize: 36,
      fontWeight: "bold",
    },
    h2: {
      fontSize: 24,
      fontWeight: "bold",
    },
  },
});

export default theme;
