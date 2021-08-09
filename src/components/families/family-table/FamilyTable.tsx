import React, { useContext, useCallback } from "react";

import { Typography } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
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
import QuestionType from "constants/QuestionType";
import { DynamicFieldsContext } from "context/DynamicFieldsContext";
import { DefaultField, DynamicField } from "types";

const stickyColumnWidth = 116;
const stickyColumnPaddingX = 16;

const options: MUIDataTableOptions = {
  responsive: "standard",
  rowsPerPage: 25,
  rowsPerPageOptions: [25, 50, 100],
  selectableRows: "none",
  elevation: 0,
  setTableProps: () => ({
    style: {
      borderCollapse: "separate",
    },
  }),
};

const stickyColumnStyles = {
  backgroundColor: "inherit",
  left: 0,
  maxWidth: stickyColumnWidth,
  minWidth: stickyColumnWidth,
  position: "sticky",
  zIndex: 101,
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
  const { parentDynamicFields } = useContext(DynamicFieldsContext);

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
        enrolled_class: null,
        preferred_class: null,
        status: EnrolmentStatus.UNASSIGNED,
      };
      const familyRow: FamilyTableRow = {
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

  const getStickyColumn = (
    column: MUIDataTableColumn,
    isLast: boolean,
    offset: number
  ): MUIDataTableColumn => {
    const columnStyles = {
      ...stickyColumnStyles,
      left: offset,
      ...(isLast && {
        borderRight: `1px solid ${grey[300]}`,
      }),
    };
    return {
      ...column,
      options: {
        ...column.options,
        setCellHeaderProps: () => ({
          style: columnStyles,
        }),
        setCellProps: () => ({
          style: columnStyles,
        }),
      },
    };
  };

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
    getStickyColumn(getColumn(DefaultFields.FIRST_NAME, false), false, 0),
    getStickyColumn(
      getColumn(DefaultFields.LAST_NAME, false),
      true,
      stickyColumnWidth + stickyColumnPaddingX * 2
    ),

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
      .filter((field) => field !== DefaultFields.ENROLLED_CLASS)
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
