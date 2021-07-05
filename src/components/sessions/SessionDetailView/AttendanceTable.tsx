import React from "react"; // , { ReactNode }, useContext, useState, useCallback,
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
} from "mui-datatables";
// import { Typography } from "@material-ui/core";
// import { DynamicFieldsContext } from "../../context/DynamicFieldsContext";
// import FamilyDetailsSidebar from "./FamilyDetailsSidebar";
// import { DefaultField, DynamicField } from "../../types";
// import DefaultFieldKey from "../../constants/DefaultFieldKey";
// import {
//   DefaultAttendanceTableFields,
//   DefaultFields,
// } from "../../constants/DefaultFields";
// import QuestionTypes from "../../constants/QuestionTypes";
import { ClassDetailResponse } from "../../../api/ClassAPI";

const options: MUIDataTableOptions = {
  responsive: "standard",
  rowsPerPage: 25,
  rowsPerPageOptions: [25, 50, 100],
  selectableRows: "none",
  elevation: 0,
};

// const noWrapText = (value: string): ReactNode => (
//   <Typography noWrap variant="body2">
//     {value}
//   </Typography>
// );

type AttendanceTableRow = Pick<
  ClassDetailResponse,
  "id" | "name" | "attendance" | "families"
>;

// const getAge = (dateString: string): number => {
//   const today = new Date();
//   const birthDate = new Date(dateString);
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const m = today.getMonth() - birthDate.getMonth();
//   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//     age -= 1;
//   }
//   return age;
// };

type AttendanceTableProps = {
  classes: ClassDetailResponse[];
  // enrolmentFields: DefaultField[];
  // shouldDisplayDynamicFields: boolean;
};

const AttendanceTable = ({
  classes,
}: // enrolmentFields,
// shouldDisplayDynamicFields,
AttendanceTableProps) => {
  // const { parentDynamicFields } = useContext(DynamicFieldsContext);
  // const [openFamilyDetail, setOpenFamilyDetail] = useState(false);
  // const [familyId, setFamilyId] = useState<number>();
  // const testData = [["test"], ["test2"], ["test3"], ["test4"]];
  /* eslint no-console: "error" */
  // eslint-disable-next-line no-console
  console.log(classes);
  const getTableRows = (): AttendanceTableRow[] =>
    // classes.map(({ name, attendance, families }) => {
      // let childrenInfo = "";
      // children.forEach((child) => {
        // if (child.date_of_birth != null) {
        //   childrenInfo += `${child.first_name} (${getAge(
        //     child.date_of_birth
        //   )})`;
        // } else {
        //   childrenInfo += `${child.first_name} (N/A)`;
        // }
        // if (i < children.length - 1) {
        //   childrenInfo += ", ";
        // }
      // });
      const familyRow: AttendanceTableRow = {
        ["First Name"]: families.first_name,
        ["Last Name"]: families.last_name,
        // [DefaultFieldKey.CHILDREN]: childrenInfo,
        // ...args,
      };
      // parentDynamicFields.forEach((field) => {
      //   Object.assign(familyRow, { [field.id]: parent.information[field.id] });
      // });
      return familyRow;
    });

  const firstNameColumn: MUIDataTableColumn = {
    name: "first_name", // DefaultFields.ID.id.toString(),
    label: "First Name", // DefaultFields.ID.name,
  };

  const lastNameColumn: MUIDataTableColumn = {
    name: "last_name", // DefaultFields.ID.id.toString(),
    label: "Last Name", // DefaultFields.ID.name,
  };

  // const getColumn = (
  //   field: DefaultField | DynamicField,
  //   isDynamic: boolean
  // ): MUIDataTableColumn => ({
  //   name: field.id.toString(),
  //   label: field.name,
  //   options: {
  //     display: field.is_default && (!isDynamic || shouldDisplayDynamicFields),
  //     filter: field.question_type === QuestionTypes.MULTIPLE_CHOICE,
  //     searchable: field.question_type === QuestionTypes.TEXT,
  //     customBodyRender: noWrapText,
  //   },
  // });

  const getTableColumns: MUIDataTableColumn[] =
    // apply noWrap text to each default column
    [firstNameColumn, lastNameColumn];
  // .concat(DefaultAttendanceTableFields.map((field) => getColumn(field, false)))
  // .concat(parentDynamicFields.map((field) => getColumn(field, true)))
  // .concat(enrolmentFields.map((field) => getColumn(field, false)));

  return (
    <>
      <MUIDataTable
        title=""
        data={getTableRows()}
        columns={getTableColumns}
        options={options}
      />
    </>
  );
};

export default AttendanceTable;

/*
{familyId && (
  <FamilyDetailsSidebar
    isOpen={openFamilyDetail}
    familyId={familyId}
    handleClose={handleCloseFamilyDetail}
  />
)}
*/
