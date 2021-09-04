import React, { useContext, useCallback } from "react";

import { Typography } from "@material-ui/core";
import moment from "moment";
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
} from "mui-datatables";

import { FamilyListResponse } from "api/types";
import StatusChip from "components/common/status-chip";
import DefaultFieldKey from "constants/DefaultFieldKey";
import DefaultFields from "constants/DefaultFields";
import EnrolmentStatus from "constants/EnrolmentStatus";
import getHeaderColumns from "constants/MuiDatatables";
import QuestionType from "constants/QuestionType";
import { DynamicFieldsContext } from "context/DynamicFieldsContext";
import { DefaultField, DynamicField } from "types";

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
        padding: "10px 16px",
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
  [DefaultFieldKey.SESSION]: string;
  [DefaultFieldKey.ENROLLED_CLASS]: string;
  [DefaultFieldKey.PREFERRED_CLASS]: string;
  [DefaultFieldKey.REGISTERED_AT]: string;
  [DefaultFieldKey.CHILDREN]: string;
  [key: number]: string | number; // dynamic fields
};

type FamilyTableProps = {
  families: FamilyListResponse[];
  enrolmentFields: DefaultField[];
  onSelectFamily: (id: number) => void;
  shouldDisplayDynamicFields: boolean;
};

const FamilyTable = ({
  families,
  enrolmentFields,
  onSelectFamily,
  shouldDisplayDynamicFields,
}: FamilyTableProps) => {
  const { parentDynamicFields } = useContext(
    DynamicFieldsContext
  ).dynamicFields;

  const getTableRows = (): FamilyTableRow[] =>
    families.map(({ parent, children, enrolment, ...args }) => {
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

      const enrolmentData = enrolment || {
        created_at: null,
        enrolled_class: null,
        preferred_class: null,
        status: EnrolmentStatus.UNASSIGNED,
      };
      const familyRow: FamilyTableRow = {
        [DefaultFieldKey.REGISTERED_AT]: enrolmentData.created_at
          ? moment(enrolmentData.created_at).format("MMM D h:mma")
          : "N/A",
        [DefaultFieldKey.FIRST_NAME]: parent.first_name,
        [DefaultFieldKey.LAST_NAME]: parent.last_name,
        [DefaultFieldKey.CHILDREN]: childrenInfo,
        [DefaultFieldKey.STATUS]: enrolmentData.status,
        [DefaultFieldKey.SESSION]: enrolment ? enrolment.session.name : "N/A",
        [DefaultFieldKey.ENROLLED_CLASS]: enrolmentData.enrolled_class
          ? enrolmentData.enrolled_class.name
          : "N/A",
        [DefaultFieldKey.PREFERRED_CLASS]: enrolmentData.preferred_class
          ? enrolmentData.preferred_class.name
          : "N/A",
        ...args,
      };
      parentDynamicFields.forEach((field) => {
        Object.assign(familyRow, {
          [field.id]: parent.information[field.id]?.split("\n").join(", "),
        });
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
      filter: field.question_type === QuestionType.SELECT,
      searchable: field.question_type === QuestionType.TEXT,
      customBodyRender: (value) => (
        <Typography noWrap variant="body2">
          {value}
        </Typography>
      ),
    },
  });

  const enrolledClassColumn: MUIDataTableColumn = {
    name: DefaultFields.ENROLLED_CLASS.id,
    label: DefaultFields.ENROLLED_CLASS.name,
    options: {
      customBodyRender: (value) => (
        <Typography noWrap variant="body2">
          {value}
        </Typography>
      ),
      searchable: false,
      setCellProps: (cellValue, rowIndex) => {
        const classColour =
          families[rowIndex].enrolment?.enrolled_class?.colour || "ffffff00";
        return {
          style: {
            backgroundColor: `#${classColour}`,
            paddingLeft: 16,
            paddingRight: 16,
          },
        };
      },
    },
  };

  const columns: MUIDataTableColumn[] = [
    // hidden ID column
    idColumn,

    // sticky first and last name columns
    ...getHeaderColumns([
      ...(enrolmentFields.includes(DefaultFields.REGISTERED_AT)
        ? [getColumn(DefaultFields.REGISTERED_AT, false)]
        : []),
      getColumn(DefaultFields.FIRST_NAME, false),
      getColumn(DefaultFields.LAST_NAME, false),
    ]),

    // remaining default fields
    ...[
      DefaultFields.PHONE_NUMBER,
      DefaultFields.EMAIL,
      DefaultFields.NUM_CHILDREN,
      DefaultFields.CHILDREN,
      DefaultFields.PREFERRED_CONTACT,
    ].map((field) => getColumn(field, false)),

    // dynamic fields
    ...parentDynamicFields.map((field) => getColumn(field, true)),

    // enrolment columns
    ...enrolmentFields
      .filter(
        (field) =>
          field !== DefaultFields.REGISTERED_AT &&
          field !== DefaultFields.ENROLLED_CLASS
      )
      .map((field) => getColumn(field, false)),
    ...(enrolmentFields.includes(DefaultFields.ENROLLED_CLASS)
      ? [enrolledClassColumn]
      : []),
    statusColumn,
  ];

  options.onRowClick = useCallback((rowData) => {
    onSelectFamily(rowData[0]);
  }, []);

  return (
    <MUIDataTable
      title=""
      data={getTableRows()}
      columns={columns}
      options={options}
    />
  );
};

export default FamilyTable;
