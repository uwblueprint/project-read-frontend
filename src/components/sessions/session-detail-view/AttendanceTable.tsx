import React, { useEffect, useState } from "react";

import {
  Button,
  Checkbox,
  createMuiTheme,
  MuiThemeProvider,
} from "@material-ui/core";
import _ from "lodash";
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
} from "mui-datatables";

import { ClassDetailResponse, ClassRequest } from "api/types";

type AttendanceTableRow = {
  id: string;
  first_name: string;
  last_name: string;
  [key: string]: string;
};

type AttendanceTableProps = {
  classObj: ClassDetailResponse;
  isEditing: boolean;
  onSubmit: (data: ClassRequest) => void;
};

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const AttendanceTable = ({
  classObj,
  isEditing,
  onSubmit,
}: AttendanceTableProps) => {
  const [data, setData] = useState<ClassRequest>(_.cloneDeep(classObj));
  const [tableRows, setTableRows] = useState<AttendanceTableRow[]>([]);

  const handleCheckboxOnClick = (id: number, date: string) => {
    const dateIndex = data.attendance.findIndex(
      (element: { date: string }) => element.date === date
    );
    const idIndex = data.attendance[dateIndex].attendees.findIndex(
      (element) => element === id
    );
    const newData: ClassDetailResponse = _.cloneDeep(data);
    if (idIndex === -1) {
      newData.attendance[dateIndex].attendees.push(id);
    } else {
      newData.attendance[dateIndex].attendees.splice(idIndex, 1);
    }
    setData(newData);
  };

  const getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MUIDataTableToolbar: {
          actions: {
            display: "flex",
            flexDirection: "row",
            flex: "initial",
          },
        },
      },
    });

  const options: MUIDataTableOptions = {
    responsive: "standard",
    rowsPerPage: 25,
    rowsPerPageOptions: [25, 50, 100],
    selectableRows: "none",
    elevation: 0,
    customToolbar: () => (
      <Button
        variant="outlined"
        color={!isEditing ? "default" : "primary"}
        onClick={() => onSubmit(data)}
        style={{ order: -1, height: 36, marginTop: 5, marginRight: 15 }}
      >
        {!isEditing ? "Take Attendance " : "Done Attendance "}
        &#10003;
      </Button>
    ),
  };

  const getTableRows = (): AttendanceTableRow[] => {
    const rows: AttendanceTableRow[][] = [];
    const currFamily = classObj.families.flatMap((family) => {
      const familyNames: AttendanceTableRow[] = [];
      const parentRow: AttendanceTableRow = {
        id: family.parent.id.toString(),
        first_name: `${family.parent.first_name} (parent)`,
        last_name: family.parent.last_name,
      };
      data.attendance.forEach((currClass) => {
        parentRow[currClass.date] =
          currClass.attendees.filter((id) => id === family.parent.id).length > 0
            ? "yes"
            : "no";
      });
      familyNames.push(parentRow);
      family.children.forEach((child) => {
        const childRow: AttendanceTableRow = {
          id: child.id.toString(),
          first_name: child.first_name,
          last_name: child.last_name,
        };
        data.attendance.forEach((currClass) => {
          childRow[currClass.date] =
            currClass.attendees.filter((id) => id === child.id).length > 0
              ? "yes"
              : "no";
        });
        familyNames.push(childRow);
      });
      return familyNames;
    });
    rows.push(currFamily);
    return rows.flat();
  };

  useEffect(() => {
    setTableRows(getTableRows());
  }, [data]);

  const getTableColumns = (): MUIDataTableColumn[] => {
    const idColumn: MUIDataTableColumn = {
      name: "id",
      options: { display: "excluded" },
    };
    const firstNameColumn: MUIDataTableColumn = {
      name: "first_name",
      label: "First Name",
    };
    const lastNameColumn: MUIDataTableColumn = {
      name: "last_name",
      label: "Last Name",
    };
    const dateColumns: MUIDataTableColumn[] = [];
    data.attendance.forEach((currClass) => {
      // eslint-disable-next-line prefer-template
      const currDate = new Date(currClass.date + " ");
      const dateColumn: MUIDataTableColumn = {
        name: currClass.date,
        label: `${monthNames[currDate.getMonth()]} ${String(
          currDate.getDate()
        )}`,
        options: {
          customBodyRender: (value, tableMeta) => (
            <Checkbox
              checked={value === "yes"}
              disabled={!isEditing}
              color="primary"
              inputProps={{ "aria-label": "secondary checkbox" }}
              onChange={() =>
                handleCheckboxOnClick(
                  Number(tableMeta.rowData[0]),
                  currDate.toISOString().split("T")[0]
                )
              }
            />
          ),
        },
      };
      dateColumns.push(dateColumn);
    });
    return [idColumn, firstNameColumn, lastNameColumn].concat(dateColumns);
  };

  return (
    <>
      <MuiThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title=""
          data={tableRows}
          columns={getTableColumns()}
          options={options}
        />
      </MuiThemeProvider>
    </>
  );
};

export default AttendanceTable;
