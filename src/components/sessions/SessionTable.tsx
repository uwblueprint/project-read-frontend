import React, { ReactNode } from "react";
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
} from "mui-datatables";
import { Box, Typography } from "@material-ui/core";
import DefaultFieldKey from "../../constants/DefaultFieldKey";
import { FamilyListResponse } from "../../api/FamilyAPI";
import { DefaultField, DynamicField } from "../../types";
import {
  DefaultFields,
  DefaultSessionsTableFields,
  DefaultSessionsTableEnrolmentFields,
} from "../../constants/DefaultFields";
import QuestionTypes from "../../constants/QuestionTypes";

type FamilyTableRow = Pick<
  FamilyListResponse,
  | DefaultFieldKey.CURRENT_CLASS
  | DefaultFieldKey.EMAIL
  | DefaultFieldKey.ENROLLED
  | DefaultFieldKey.ID
  | DefaultFieldKey.PHONE_NUMBER
  | DefaultFieldKey.PREFERRED_CONTACT
  | DefaultFieldKey.NUM_CHILDREN
  | DefaultFieldKey.STATUS
> & {
  [DefaultFieldKey.FIRST_NAME]: string;
  [DefaultFieldKey.LAST_NAME]: string;
  // [key: number]: string | number; // dynamic fields
};

type SessionTableProps = {
  families: FamilyTableRow[];
};

const noWrapText = (value: string): ReactNode => (
  <Typography noWrap variant="body2">
    {value}
  </Typography>
);

const options: MUIDataTableOptions = {
  responsive: "standard",
  rowsPerPage: 25,
  rowsPerPageOptions: [25, 50, 100],
  selectableRows: "none",
  search: true,
  searchOpen: true,
  elevation: 0,
};

const idColumn: MUIDataTableColumn = {
  name: DefaultFields.ID.id.toString(),
  label: DefaultFields.ID.name,
  options: { display: "excluded", filter: false },
};

const getColumn = (field: DefaultField | DynamicField): MUIDataTableColumn => ({
  name: field.id.toString(),
  label: field.name,
  options: {
    display: field.is_default,
    filter: field.question_type === QuestionTypes.MULTIPLE_CHOICE,
    searchable: field.question_type === QuestionTypes.TEXT,
    customBodyRender: noWrapText,
  },
});

const getTableColumns: MUIDataTableColumn[] = [idColumn]
  .concat(DefaultSessionsTableFields.map((field) => getColumn(field)))
  // .concat(parentDynamicFields.map((field) => getColumn(field)))
  .concat(DefaultSessionsTableEnrolmentFields.map((field) => getColumn(field)));

const SessionTable = ({ families }: SessionTableProps) => (
  <>
    <Box>
      <MUIDataTable
        title=""
        data={families}
        columns={getTableColumns}
        options={options}
      />
    </Box>
  </>
);

export default SessionTable;
