import React, { useContext, useState, useCallback, ReactNode } from "react";
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableColumnOptions,
  MUIDataTableOptions,
} from "mui-datatables";
import { Typography } from "@material-ui/core";
import { FieldsContext } from "../../context/fields";
import FamilyTableColumns from "../../constants/registration/FamilyTableColumns";
import QuestionTypes from "../../constants/QuestionTypes";
import FamilyDetailsSidebar from "./FamilyDetailsSidebar";
import { Family, Field } from "../../types";
import { DefaultFieldName } from "../../constants/DefaultFields";

const options: MUIDataTableOptions = {
  responsive: "standard",
  rowsPerPage: 25,
  rowsPerPageOptions: [25, 50, 100],
  selectableRows: "none",
};

const noWrapText = (value: string): ReactNode => (
  <Typography noWrap variant="body2">
    {value}
  </Typography>
);

const noWrapOption: MUIDataTableColumnOptions = {
  customBodyRender: noWrapText,
};

type FamilyTableRow = Pick<
  Family,
  | DefaultFieldName.EMAIL
  | DefaultFieldName.ID
  | DefaultFieldName.NUM_CHILDREN
  | DefaultFieldName.PHONE_NUMBER
  | DefaultFieldName.PREFERRED_CONTACT
> & {
  [DefaultFieldName.FIRST_NAME]: string;
  [DefaultFieldName.LAST_NAME]: string;
  [key: number]: string | number; // dynamic fields
};

type FamilyTableProps = {
  families: Family[];
};

function FamilyTable({ families }: FamilyTableProps) {
  const { parentFields } = useContext(FieldsContext);
  const [openFamilyDetail, setOpenFamilyDetail] = useState(false);
  const [familyId, setFamilyId] = useState(null);

  const getTableRows = (): FamilyTableRow[] =>
    families.map(({ parent, ...args }) => {
      const familyRow: FamilyTableRow = {
        [DefaultFieldName.FIRST_NAME]: parent.first_name,
        [DefaultFieldName.LAST_NAME]: parent.last_name,
        ...args,
      };
      // add dynamic column values
      parentFields.forEach((field: Field) => {
        Object.assign(familyRow, { [field.id]: parent.information[field.id] });
      });
      return familyRow;
    });

  const getTableColumns: MUIDataTableColumn[] =
    // apply noWrap text to each default column
    FamilyTableColumns.map((column) =>
      Object.assign(
        column,
        column.options
          ? Object.assign(column.options, noWrapOption)
          : noWrapOption
      )
    )
      // add dynamic columns
      .concat(
        parentFields.map((field: Field) => ({
          name: field.id.toString(),
          label: field.name,
          options: {
            display: field.is_default,
            filter: field.question_type === QuestionTypes.MULTIPLE_CHOICE,
            searchable: field.question_type === QuestionTypes.TEXT,
            customBodyRender: noWrapText,
          },
        }))
      );

  const handleOpenFamilyDetail = useCallback((rowData) => {
    setFamilyId(rowData[0].props.children);
    setOpenFamilyDetail(true);
  }, []);

  const handleCloseFamilyDetail = useCallback(() => {
    setOpenFamilyDetail(false);
  }, []);

  options.onRowClick = handleOpenFamilyDetail;

  return (
    <>
      <MUIDataTable
        title=""
        data={getTableRows()}
        columns={getTableColumns}
        options={options}
      />
      <FamilyDetailsSidebar
        isOpen={openFamilyDetail}
        familyId={familyId}
        handleClose={handleCloseFamilyDetail}
      />
    </>
  );
}

export default FamilyTable;
