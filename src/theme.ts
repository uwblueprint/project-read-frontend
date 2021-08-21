import { createMuiTheme } from "@material-ui/core/styles";

const defaultTheme = createMuiTheme();

const theme = createMuiTheme({
  palette: {
    type: "light",
    backgroundSecondary: {
      default: "#091e420A",
      paper: "#F5F5F5",
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
        zIndex: defaultTheme.zIndex.drawer + 1,
      },
    },
    MuiButton: {
      root: {
        textTransform: "none",
      },
    },
    MuiDialogContent: {
      root: {
        paddingLeft: 48,
        paddingRight: 48,
        paddingBottom: 48,
      },
    },
    MuiDialogTitle: {
      root: {
        paddingLeft: 48,
        paddingRight: 48,
        paddingTop: 48,
      },
    },
    MuiInputLabel: {
      root: {
        color: defaultTheme.palette.text.primary,
        fontSize: 16,
        fontWeight: 700,
        position: "relative",
        transform: "none",
        wordBreak: "break-word",
      },
    },
    MuiSnackbar: {
      root: {
        top: "80px !important",
      },
    },
    MuiSnackbarContent: {
      root: {
        backgroundColor: "#ECE0FD",
        color: defaultTheme.palette.text.primary,
      },
    },
    MuiTab: {
      root: {
        minWidth: 0,
        backgroundColor: "#E7E7E7",
        borderRadius: "15px 15px 0px 0px",
        border: "1px solid #C8C8C8",
        fontWeight: 700,
        textTransform: "none",
        "@media (min-width: 0px)": {
          minWidth: 0,
        },
        "&$selected": {
          borderBottom: "1px solid white",
          backgroundColor: "white",
        },
      },
    },
    MuiTableCell: {
      root: {
        '& [class*="MuiTableCell-footer"]': {
          borderBottom: "none",
        },
      },
    },
    MuiTableContainer: {
      root: {
        border: "1px solid",
        borderColor: defaultTheme.palette.divider,
      },
    },
    MuiTableRow: {
      root: {
        backgroundColor: defaultTheme.palette.background.paper,
        "&$hover:hover": {
          backgroundColor: "rgb(245, 245, 245)",
        },
      },
    },
    MuiTabs: {
      root: {
        backgroundColor: "white",
        color: "black",
      },
    },
  },
  props: {
    MuiButton: {
      disableElevation: true,
    },
    MuiSelect: {
      MenuProps: {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
        transformOrigin: {
          vertical: "top",
          horizontal: "left",
        },
        getContentAnchorEl: null,
      },
    },
  },
  typography: {
    h1: {
      fontSize: 36,
      fontWeight: "bold",
    },
    h2: {
      fontSize: 34,
      fontWeight: "bold",
    },
    h3: {
      fontSize: 24,
      fontWeight: "bold",
    },
    h4: {
      fontSize: 16,
      fontWeight: "bold",
    },
  },
});

export default theme;
