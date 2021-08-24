import { grey } from "@material-ui/core/colors";
import { MUIDataTableColumn } from "mui-datatables";

const STICKY_COLUMN_WIDTH = 116;
const STICKY_COLUMN_PADDING_X = 16;

const STICKY_COLUMN_STYLES = {
  backgroundColor: "inherit",
  left: 0,
  maxWidth: STICKY_COLUMN_WIDTH,
  minWidth: STICKY_COLUMN_WIDTH,
  position: "sticky",
  zIndex: 101,
};

const getHeaderColumns = (
  columns: MUIDataTableColumn[]
): MUIDataTableColumn[] =>
  columns.map((column, index) => {
    const style = {
      ...STICKY_COLUMN_STYLES,
      ...(index === columns.length - 1 && {
        left: STICKY_COLUMN_WIDTH + STICKY_COLUMN_PADDING_X * 2,
        borderRight: `1px solid ${grey[300]}`,
      }),
    };
    return {
      ...column,
      options: {
        ...column.options,
        setCellHeaderProps: () => ({
          style,
        }),
        setCellProps: () => ({
          style,
        }),
      },
    };
  });

export default getHeaderColumns;
