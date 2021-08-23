import React, { useEffect, useState } from "react";

import { Box, Button, Checkbox, IconButton, Tooltip } from "@material-ui/core";
import { Add, SupervisorAccountOutlined } from "@material-ui/icons";
import CheckIcon from "@material-ui/icons/Check";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/styles";
import _ from "lodash";
import moment from "moment";
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
} from "mui-datatables";

import { ClassDetailResponse, ClassDetailRequest } from "api/types";
import DefaultFieldKey from "constants/DefaultFieldKey";
import getHeaderColumns from "constants/MuiDatatables";
import StudentRole from "constants/StudentRole";
import theme from "theme";
import { Attendance } from "types";

type AttendanceTableRow = {
  id: string;
  role: StudentRole;
  first_name: string;
  last_name: string;
  [key: string]: string; // array of dates and student's attendance is represented as "yes" or "no"
};

type Props = {
  classObj: ClassDetailResponse;
  isEditing: boolean;
  onSubmit: (data: ClassDetailRequest) => void;
};

const useStyles = makeStyles(() => ({
  button: {
    order: -1,
    height: 36,
    marginTop: 5,
    marginRight: 15,
    textTransform: "none",
  },
  checkmark: {
    height: "20px",
    width: "20px",
    marginLeft: "8px",
  },
}));

const AttendanceTable = ({ classObj, isEditing, onSubmit }: Props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<ClassDetailRequest>(_.cloneDeep(classObj));
  const [tableRows, setTableRows] = useState<AttendanceTableRow[]>([]);
  const [tableColumns, setTableColumns] = useState<MUIDataTableColumn[]>([]);

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

  const addDate = (date: string) => {
    const dateIndex = data.attendance.findIndex(
      (element: { date: string }) => element.date === date
    );
    if (dateIndex === -1) {
      const newData: ClassDetailResponse = _.cloneDeep(data);
      const newDate: Attendance = {
        date,
        attendees: [],
      };
      newData.attendance.push(newDate);
      setData(newData);
    }
  };

  const options: MUIDataTableOptions = {
    responsive: "standard",
    pagination: false,
    selectableRows: "none",
    elevation: 0,
    customToolbar: () => (
      <>
        <Button
          variant="outlined"
          color={!isEditing ? "default" : "primary"}
          onClick={() => onSubmit(data)}
          className={classes.button}
        >
          {!isEditing ? "Take attendance " : "Done attendance "}
          <CheckIcon className={classes.checkmark} />
        </Button>
        {isEditing ? (
          <>
            <Tooltip title="Add Date">
              <IconButton onClick={() => setOpen(true)}>
                <Add />
              </IconButton>
            </Tooltip>
            <KeyboardDatePicker
              disableToolbar
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              onChange={(date) =>
                date ? addDate(date.toDate().toISOString().split("T")[0]) : null
              }
              TextFieldComponent={() => null}
              value={null}
            />
          </>
        ) : null}
      </>
    ),
    setRowProps: (row, dataIndex, rowIndex) => ({
      style: {
        ...(tableRows[rowIndex].role !== StudentRole.PARENT && {
          backgroundColor: theme.palette.background.default,
        }),
      },
    }),
  };

  const getTableRows = (): AttendanceTableRow[] => {
    const rows: AttendanceTableRow[] = [];
    classObj.families.forEach((family) => {
      const parentRow: AttendanceTableRow = {
        id: family.parent.id.toString(),
        role: StudentRole.PARENT,
        first_name: family.parent.first_name,
        last_name: family.parent.last_name,
      };
      data.attendance.forEach((currClass) => {
        parentRow[currClass.date] = currClass.attendees.includes(
          family.parent.id
        )
          ? "yes"
          : "no";
      });
      rows.push(parentRow);
      family.children.forEach((child) => {
        const childRow: AttendanceTableRow = {
          id: child.id.toString(),
          role: StudentRole.CHILD,
          first_name: child.first_name,
          last_name: child.last_name,
        };
        data.attendance.forEach((currClass) => {
          childRow[currClass.date] = currClass.attendees.includes(child.id)
            ? "yes"
            : "no";
        });
        rows.push(childRow);
      });
      family.guests.forEach((guest) => {
        const guestRow: AttendanceTableRow = {
          id: guest.id.toString(),
          role: StudentRole.GUEST,
          first_name: `${guest.first_name} (guest)`,
          last_name: guest.last_name,
        };
        data.attendance.forEach((currClass) => {
          guestRow[currClass.date] = currClass.attendees.includes(guest.id)
            ? "yes"
            : "no";
        });
        rows.push(guestRow);
      });
    });
    return rows;
  };

  useEffect(() => {
    setTableRows(getTableRows());
  }, [data]);

  const getTableColumns = (): MUIDataTableColumn[] => {
    if (!tableRows.length) {
      return [];
    }
    const firstNameColumn: MUIDataTableColumn = {
      name: DefaultFieldKey.FIRST_NAME,
      label: "First name",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => (
          <Box display="flex" alignItems="center">
            <Box paddingRight={1}> {tableRows[rowIndex].first_name}</Box>
            {tableRows[rowIndex].role === StudentRole.PARENT && (
              <SupervisorAccountOutlined color="action" />
            )}
          </Box>
        ),
      },
    };
    const lastNameColumn: MUIDataTableColumn = {
      name: DefaultFieldKey.LAST_NAME,
      label: "Last name",
    };
    const dateColumns: MUIDataTableColumn[] = data.attendance.map(
      (currClass) => {
        const dateColumn: MUIDataTableColumn = {
          name: currClass.date,
          label: moment(currClass.date).isValid()
            ? moment(currClass.date).format("MMM D")
            : currClass.date,
          options: {
            customBodyRender: (value, tableMeta) => (
              <Checkbox
                checked={value === "yes"}
                disabled={!isEditing}
                color="primary"
                inputProps={{ "aria-label": "attendance date checkbox" }}
                onChange={() =>
                  handleCheckboxOnClick(
                    Number(tableMeta.rowData[0]),
                    currClass.date
                  )
                }
              />
            ),
            setCellProps: () => ({
              style: {
                minWidth: 64,
                padding: "0px 16px",
              },
            }),
          },
        };
        return dateColumn;
      }
    );
    return [
      {
        name: DefaultFieldKey.ID,
        options: {
          display: "excluded",
        },
      } as MUIDataTableColumn,
      {
        name: "role",
        options: {
          display: "excluded",
        },
      } as MUIDataTableColumn,
    ]
      .concat(getHeaderColumns([firstNameColumn, lastNameColumn]))
      .concat(dateColumns);
  };

  useEffect(() => {
    setData(_.cloneDeep(classObj));
    setTableColumns([]);
  }, [classObj]);

  useEffect(() => {
    setTableColumns(getTableColumns());
  }, [tableRows, isEditing]);

  return (
    <MUIDataTable
      title=""
      data={tableRows}
      columns={tableColumns}
      options={options}
    />
  );
};

export default AttendanceTable;
