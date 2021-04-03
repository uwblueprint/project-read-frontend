import { createMuiTheme } from "@material-ui/core/styles";

const defaultTheme = createMuiTheme();

const theme = createMuiTheme({
  overrides: {
    MuiContainer: {
      root: {
        [defaultTheme.breakpoints.up("lg")]: {
          paddingLeft: 54,
          paddingRight: 54,
        },
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
