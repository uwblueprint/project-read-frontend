import React, { useContext, useState, useCallback } from "react";
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
} from "mui-datatables";
import { Typography } from "@material-ui/core";
import { DynamicFieldsContext } from "../../context/DynamicFieldsContext";
import FamilyDetailsSidebar from "./FamilyDetailsSidebar";
import { DefaultField, DynamicField } from "../../types";
import DefaultFieldKey from "../../constants/DefaultFieldKey";
import {
  DefaultFamilyTableFields,
  DefaultFields,
} from "../../constants/DefaultFields";
import QuestionTypes from "../../constants/QuestionTypes";
import { FamilyListResponse } from "../../api/FamilyAPI";
import StatusChip from "../common/status-chip";
import EnrolmentStatus from "../../constants/EnrolmentStatus";

const options: MUIDataTableOptions = {
  responsive: "standard",
  rowsPerPage: 25,
  rowsPerPageOptions: [25, 50, 100],
  selectableRows: "none",
  elevation: 0,
};

const idColumn: MUIDataTableColumn = {
  name: DefaultFields.ID.id.toString(),
  label: DefaultFields.ID.name,
  options: { display: "excluded", filter: false },
};

const statusColumn: MUIDataTableColumn = {
  name: DefaultFields.STATUS.id.toString(),
  label: DefaultFields.STATUS.name,
  options: {
    customBodyRender: (value) => (
      <StatusChip status={value as EnrolmentStatus} />
    ),
    searchable: false,
    setCellProps: () => ({
      style: {
        paddingTop: 10,
        paddingBottom: 10,
      },
    }),
  },
};

type FamilyTableRow = Pick<
  FamilyListResponse,
  | DefaultFieldKey.CURRENT_CLASS
  | DefaultFieldKey.EMAIL
  | DefaultFieldKey.ENROLLED
  | DefaultFieldKey.ID
  | DefaultFieldKey.NUM_CHILDREN
  | DefaultFieldKey.PHONE_NUMBER
  | DefaultFieldKey.PREFERRED_CONTACT
  | DefaultFieldKey.STATUS
> & {
  [DefaultFieldKey.FIRST_NAME]: string;
  [DefaultFieldKey.LAST_NAME]: string;
  [DefaultFieldKey.CHILDREN]: string;
  [key: number]: string | number; // dynamic fields
};

const getAge = (dateString: string): number => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
};

type FamilyTableProps = {
  families: FamilyListResponse[];
  enrolmentFields: DefaultField[];
  shouldDisplayDynamicFields: boolean;
};

const FamilyTable = ({
  families,
  enrolmentFields,
  shouldDisplayDynamicFields,
}: FamilyTableProps) => {
  const { parentDynamicFields } = useContext(DynamicFieldsContext);
  const [openFamilyDetail, setOpenFamilyDetail] = useState(false);
  const [familyId, setFamilyId] = useState<number>();

  const getTableRows = (): FamilyTableRow[] =>
    families.map(({ parent, children, ...args }) => {
      let childrenInfo = "";
      children.forEach((child, i) => {
        if (child.date_of_birth != null) {
          childrenInfo += `${child.first_name} (${getAge(
            child.date_of_birth
          )})`;
        } else {
          childrenInfo += `${child.first_name} (N/A)`;
        }
        if (i < children.length - 1) {
          childrenInfo += ", ";
        }
      });
      const familyRow: FamilyTableRow = {
        [DefaultFieldKey.FIRST_NAME]: parent.first_name,
        [DefaultFieldKey.LAST_NAME]: parent.last_name,
        [DefaultFieldKey.CHILDREN]: childrenInfo,
        ...args,
      };
      parentDynamicFields.forEach((field) => {
        Object.assign(familyRow, { [field.id]: parent.information[field.id] });
      });
      return familyRow;
    });

  const getColumn = (
    field: DefaultField | DynamicField,
    isDynamic: boolean
  ): MUIDataTableColumn => ({
    name: field.id.toString(),
    label: field.name,
    options: {
      display: field.is_default && (!isDynamic || shouldDisplayDynamicFields),
      filter: field.question_type === QuestionTypes.MULTIPLE_CHOICE,
      searchable: field.question_type === QuestionTypes.TEXT,
      customBodyRender: (value) => (
        <Typography noWrap variant="body2">
          {value}
        </Typography>
      ),
    },
  });

  const getTableColumns: MUIDataTableColumn[] = [
    idColumn,
    ...DefaultFamilyTableFields.map((field) => getColumn(field, false)),
    ...parentDynamicFields.map((field) => getColumn(field, true)),
    ...enrolmentFields.map((field) => getColumn(field, false)),
    statusColumn,
  ];

  const handleOpenFamilyDetail = useCallback((rowData) => {
    setFamilyId(rowData[0]);
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
      {familyId && (
        <FamilyDetailsSidebar
          isOpen={openFamilyDetail}
          familyId={familyId}
          handleClose={handleCloseFamilyDetail}
        />
      )}
    </>
  );
};

export default FamilyTable;
