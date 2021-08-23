import React, { useCallback, useEffect, useState } from "react";

import { Box, Button, Checkbox, IconButton, Tooltip } from "@material-ui/core";
import { Add, Check, SupervisorAccountOutlined } from "@material-ui/icons";
import { KeyboardDatePicker } from "@material-ui/pickers";
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

import useStyles from "./styles";

const FAMILY_ID_DATA_INDEX = 0;
const STUDENT_ID_DATA_INDEX = 1;

type AttendanceTableRow = {
  family_id: string;
  id: string;
  role: StudentRole;
  first_name: string;
  last_name: string;
  [key: string]: string; // array of dates and student's attendance is represented as "yes" or "no"
};

type Props = {
  classObj: ClassDetailResponse;
  isEditing: boolean;
  onClickAddGuest: () => void;
  onSelectFamily: (id: number) => void;
  onSubmit: (data: ClassDetailRequest) => void;
};

const AttendanceTable = ({
  classObj,
  isEditing,
  onClickAddGuest,
  onSelectFamily,
  onSubmit,
}: Props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<ClassDetailRequest>(_.cloneDeep(classObj));
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
          <Check className={classes.buttonIcon} />
        </Button>
        <Tooltip
          aria-label="currently editing attendance"
          disableHoverListener={!isEditing}
          title="Please save attendance before adding a guest"
        >
          <span className={classes.button}>
            <Button
              disabled={isEditing}
              onClick={onClickAddGuest}
              variant="outlined"
            >
              Add a guest
              <Add className={classes.buttonIcon} />
            </Button>
          </span>
        </Tooltip>
        {isEditing && (
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
        )}
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
        family_id: family.id.toString(),
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
      family.children
        .filter((child) => family.enrolment?.students.includes(child.id))
        .forEach((child) => {
          const childRow: AttendanceTableRow = {
            family_id: family.id.toString(),
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
      family.guests
        .filter((guest) => family.enrolment?.students.includes(guest.id))
        .forEach((guest) => {
          const guestRow: AttendanceTableRow = {
            family_id: family.id.toString(),
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
                    Number(tableMeta.rowData[STUDENT_ID_DATA_INDEX]),
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
        // corresponds to FAMILY_ID_DATA_INDEX
        name: "family_id",
        options: {
          display: "excluded",
        },
      } as MUIDataTableColumn,
      {
        // corresponds to STUDENT_ID_DATA_INDEX
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

  options.onRowClick = useCallback((rowData) => {
    if (!isEditing) {
      onSelectFamily(rowData[FAMILY_ID_DATA_INDEX]);
    }
  }, []);

  return (
    <MUIDataTable
      title=""
      data={tableRows}
      columns={getTableColumns()}
      options={options}
    />
  );
};

export default AttendanceTable;
