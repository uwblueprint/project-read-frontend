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
    MuiTabs: {
      root: {
        backgroundColor: "white",
        color: "black",
        borderBottom: "1px solid #C8C8C8",
      },
    },
    MuiTab: {
      root: {
        minWidth: 0,
        backgroundColor: "#E7E7E7",
        borderRadius: "15px 15px 0px 0px",
        opacity: "100%",
        border: "1px solid #C8C8C8",
        borderBottom: "0px",
        fontWeight: 700,
        textTransform: "none",
        "@media (min-width: 0px)": {
          minWidth: 0,
        },
        "&$selected": {
          backgroundColor: "white",
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
