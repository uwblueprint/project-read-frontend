import React, { useContext, useState, useCallback } from "react";

import { Typography } from "@material-ui/core";
import moment from "moment";
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
} from "mui-datatables";

import { FamilyListResponse } from "api/types";
import DefaultFieldKey from "constants/DefaultFieldKey";
import {
  DefaultFamilyTableFields,
  DefaultFields,
} from "constants/DefaultFields";
import EnrolmentStatus from "constants/EnrolmentStatus";
import QuestionType from "constants/QuestionType";
import { DynamicFieldsContext } from "context/DynamicFieldsContext";
import { DefaultField, DynamicField } from "types";

import StatusChip from "../common/status-chip";
import FamilyDetailsSidebar from "./FamilyDetailsSidebar";

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
  | DefaultFieldKey.EMAIL
  | DefaultFieldKey.ID
  | DefaultFieldKey.NUM_CHILDREN
  | DefaultFieldKey.PHONE_NUMBER
  | DefaultFieldKey.PREFERRED_CONTACT
> & {
  [DefaultFieldKey.FIRST_NAME]: string;
  [DefaultFieldKey.LAST_NAME]: string;
  [DefaultFieldKey.STATUS]: EnrolmentStatus;
  [DefaultFieldKey.IS_ENROLLED]: string;
  [DefaultFieldKey.CURRENT_CLASS]: string;
  [DefaultFieldKey.CURRENT_PREFERRED_CLASS]: string;
  [DefaultFieldKey.CHILDREN]: string;
  [key: number]: string | number; // dynamic fields
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
    families.map(({ parent, children, current_enrolment, ...args }) => {
      let childrenInfo = "";
      children.forEach((child, i) => {
        if (child.date_of_birth) {
          childrenInfo += `${child.first_name} (${moment().diff(
            child.date_of_birth,
            "years"
          )})`;
        } else {
          childrenInfo += `${child.first_name} (N/A)`;
        }
        if (i < children.length - 1) {
          childrenInfo += ", ";
        }
      });

      const enrolment = current_enrolment || {
        enrolled_class: null,
        preferred_class: null,
        status: EnrolmentStatus.UNASSIGNED,
      };
      const familyRow: FamilyTableRow = {
        [DefaultFieldKey.FIRST_NAME]: parent.first_name,
        [DefaultFieldKey.LAST_NAME]: parent.last_name,
        [DefaultFieldKey.CHILDREN]: childrenInfo,
        [DefaultFieldKey.STATUS]: enrolment.status,
        [DefaultFieldKey.IS_ENROLLED]: current_enrolment ? "True" : "False",
        [DefaultFieldKey.CURRENT_CLASS]: enrolment.enrolled_class
          ? enrolment.enrolled_class.name
          : "N/A",
        [DefaultFieldKey.CURRENT_PREFERRED_CLASS]: enrolment.preferred_class
          ? enrolment.preferred_class.name
          : "N/A",
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
      filter: field.question_type === QuestionType.MULTIPLE_CHOICE,
      searchable: field.question_type === QuestionType.TEXT,
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
