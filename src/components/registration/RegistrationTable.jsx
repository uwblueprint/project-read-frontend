import React, { useContext } from "react";
import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";

import { FieldsContext } from "../../context/fields";
import RegistrationTableColumns from "../../constants/registration/RegistrationTableColumns";
import QuestionTypes from "../../constants/QuestionTypes";

const options = {
  responsive: "standard",
  selectableRows: "none",
};

function getTableRows(families, extraFields) {
  if (extraFields.length) {
    const fieldMap = Object.assign(
      {},
      ...extraFields.map((field) => ({ [field.id]: field.name }))
    );
    families.forEach((family) => {
      const familyRow = family;
      if (family.parent && family.parent !== undefined) {
        familyRow.first_name = family.parent.first_name;
        familyRow.last_name = family.parent.last_name;
        if (family.parent.information) {
          Object.entries(family.parent.information).forEach(
            ([fieldId, value]) => {
              familyRow[fieldMap[fieldId]] = value;
            }
          );
        }
      }
      return familyRow;
    });
  }
  return families;
}

function getTableColumns(extraFields) {
  const extraColumns = [];
  extraFields.forEach((field) => {
    extraColumns.push({
      name: field.name.toString(),
      options: {
        display: field.is_default,
        filter: field.question_type === QuestionTypes.MULTIPLE_CHOICE,
        searchable: field.question_type === QuestionTypes.TEXT,
        filterOptions: { fullWidth: true },
      },
    });
  });
  return RegistrationTableColumns.concat(extraColumns);
}

function RegistrationTable({ families }) {
  const { parentFields } = useContext(FieldsContext);
  return (
    <MUIDataTable
      data={getTableRows(families, parentFields)}
      columns={getTableColumns(parentFields)}
      options={options}
    />
  );
}

RegistrationTable.propTypes = {
  families: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default RegistrationTable;
