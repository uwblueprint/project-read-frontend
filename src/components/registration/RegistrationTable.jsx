import React, { useContext, useState, useCallback } from "react";
import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";

import { FieldsContext } from "../../context/fields";
import RegistrationTableColumns from "../../constants/registration/RegistrationTableColumns";
import QuestionTypes from "../../constants/QuestionTypes";
import FamilyDetailsSidebar from "./FamilyDetailsSidebar";

const options = {
  responsive: "standard",
  rowsPerPage: 25,
  rowsPerPageOptions: [25, 50, 100],
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

function getTableData(families, extraColumns) {
  const rows = getTableRows(families, extraColumns);
  const columns = [];

  const noWrapText = (value) => (
    <Typography noWrap variant="body2">
      {value}
    </Typography>
  );
  const noWrapOption = { customBodyRender: noWrapText };

  RegistrationTableColumns.forEach((column) => {
    const columnOptions = column.options
      ? Object.assign(column.options, noWrapOption)
      : noWrapOption;
    columns.push(Object.assign(column, columnOptions));
  });

  extraColumns.forEach((field) => {
    columns.push({
      name: field.name.toString(),
      options: {
        display: field.is_default,
        filter: field.question_type === QuestionTypes.MULTIPLE_CHOICE,
        searchable: field.question_type === QuestionTypes.TEXT,
        customBodyRender: noWrapText,
      },
    });
  });

  return [rows, columns];
}

function RegistrationTable({ families }) {
  const { parentFields } = useContext(FieldsContext);
  const [rows, columns] = getTableData(families, parentFields);
  const [openFamilyDetail, setOpenFamilyDetail] = useState(false);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);

  const handleOpenFamilyDetail = useCallback((rowData, rowMeta) => {
    setCurrentRowIndex(rowMeta.rowIndex);
    setOpenFamilyDetail(true);
  }, []);

  const handleCloseFamilyDetail = useCallback(() => {
    setOpenFamilyDetail(false);
  }, []);

  options.onRowClick = handleOpenFamilyDetail;

  return (
    <div>
      <MUIDataTable data={rows} columns={columns} options={options} />
      <FamilyDetailsSidebar
        isOpen={openFamilyDetail}
        rowIndex={currentRowIndex}
        handleClose={handleCloseFamilyDetail}
      />
    </div>
  );
}

RegistrationTable.propTypes = {
  families: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default RegistrationTable;
