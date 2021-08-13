import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles<Theme, { isDefault: boolean | undefined }>(
  (theme) => ({
    card: {
      marginBottom: 8,
      marginTop: 8,
      padding: 16,
    },
    dragIcon: ({ isDefault }) => ({
      alignSelf: "center",
      cursor: isDefault ? "not-allowed" : "grab",
      height: 16,
      marginRight: 8,
      width: 16,
    }),
    editButton: {
      "& svg": {
        height: 20,
        width: 20,
      },
    },
    label: {
      alignSelf: "center",
      marginLeft: 16,
    },
    labelIcon: {
      alignSelf: "center",
      color: theme.palette.text.secondary,
      marginRight: 8,
      height: 20,
      width: 20,
    },
  })
);

export default useStyles;
