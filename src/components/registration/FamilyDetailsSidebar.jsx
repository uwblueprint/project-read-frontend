import React from "react";
import { Drawer } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

// import { FieldsContext } from "../../context/fields";
// import RegistrationTableColumns from "../../constants/registration/RegistrationTableColumns";
// import QuestionTypes from "../../constants/QuestionTypes";

// const options = {
//   responsive: "standard",
//   selectableRows: "none",
// };

// function getTableRows(families, extraFields) {
//   if (extraFields.length) {
//     const fieldMap = Object.assign(
//       {},
//       ...extraFields.map((field) => ({ [field.id]: field.name }))
//     );
//     families.forEach((family) => {
//       const familyRow = family;
//       if (family.parent && family.parent !== undefined) {
//         familyRow.first_name = family.parent.first_name;
//         familyRow.last_name = family.parent.last_name;
//         if (family.parent.information) {
//           Object.entries(family.parent.information).forEach(
//             ([fieldId, value]) => {
//               familyRow[fieldMap[fieldId]] = value;
//             }
//           );
//         }
//       }
//       return familyRow;
//     });
//   }
//   return families;
// }

// function getTableColumns(extraFields) {
//   const extraColumns = [];
//   extraFields.forEach((field) => {
//     extraColumns.push({
//       name: field.name.toString(),
//       options: {
//         display: field.is_default,
//         filter: field.question_type === QuestionTypes.MULTIPLE_CHOICE,
//         searchable: field.question_type === QuestionTypes.TEXT,
//         filterOptions: { fullWidth: true },
//       },
//     });
//   });
//   return FamilyDetailsSidebarColumns.concat(extraColumns);
// }

// function FamilyDetailsSidebar({ families }) {
//   return (
//     <Drawer anchor="right" open>
//       <p>Hello world!</p>
//     </Drawer>
//   );
// }

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
}));

function FamilyDetailsSidebar({ isOpen, handleClose }) {
  const classes = useStyles();
  return (
    <Drawer
      anchor="right"
      variant="temporary"
      className={classes.drawer}
      open={isOpen}
      onClose={handleClose}
    >
      <p>Hello world!</p>
    </Drawer>
  );
}

FamilyDetailsSidebar.defaultProps = {
  isOpen: false,
  handleClose: () => {},
};

FamilyDetailsSidebar.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default FamilyDetailsSidebar;
