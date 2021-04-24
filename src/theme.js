import { createMuiTheme } from "@material-ui/core/styles";

const defaultTheme = createMuiTheme();

const theme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: "#F3F3F3",
    },
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
  },
  typography: {
    h1: {
      fontSize: 36,
      fontWeight: "bold",
    },
  },
});

export default theme;
