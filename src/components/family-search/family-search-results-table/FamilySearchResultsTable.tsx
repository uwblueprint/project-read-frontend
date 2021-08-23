import React from "react";

import {
  Box,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TableContainer,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { FamilySearchResponse, SessionDetailResponse } from "api/types";
import RoundedOutlinedButton from "components/common/rounded-outlined-button/RoundedOutlinedButton";
import DefaultFields from "constants/DefaultFields";

const useStyles = makeStyles(() => ({
  noResultsTableCell: {
    textAlign: "center",
  },
  selectButtonTableCell: {
    paddingBottom: 8,
    paddingTop: 8,
  },
  tableContainer: {
    maxHeight: 250,
  },
}));

type Props = {
  families: FamilySearchResponse[];
  onSelectFamily: (id: number) => void;
  session?: SessionDetailResponse | null;
};

const FamilySearchResultsTable = ({
  families,
  onSelectFamily,
  session = null,
}: Props) => {
  const classes = useStyles();

  const isFamilyRegistered = (id: number): boolean =>
    session?.families.find((family) => family.id === id) !== undefined;

  return (
    <Box marginY={2}>
      <TableContainer
        component={Paper}
        elevation={0}
        className={classes.tableContainer}
      >
        <Table stickyHeader aria-label="family search results table">
          <caption hidden>Family search results</caption>
          <TableHead>
            <TableRow>
              <TableCell>{DefaultFields.FIRST_NAME.name}</TableCell>
              <TableCell>{DefaultFields.LAST_NAME.name}</TableCell>
              <TableCell>{DefaultFields.PHONE_NUMBER.name}</TableCell>
              <TableCell>{DefaultFields.EMAIL.name}</TableCell>
              <TableCell>{DefaultFields.NUM_CHILDREN.name}</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          {families.length ? (
            <TableBody>
              {families.map((family) => (
                <TableRow key={family.id}>
                  <TableCell>{family.parent.first_name}</TableCell>
                  <TableCell>{family.parent.last_name}</TableCell>
                  <TableCell>{family.phone_number}</TableCell>
                  <TableCell>{family.email}</TableCell>
                  <TableCell>{family.children.length}</TableCell>
                  <TableCell className={classes.selectButtonTableCell}>
                    {isFamilyRegistered(family.id) ? (
                      <Tooltip
                        title={`This family is already registered in ${session?.name}`}
                        aria-label="already registered"
                      >
                        <span>
                          <RoundedOutlinedButton disabled>
                            Select
                          </RoundedOutlinedButton>
                        </span>
                      </Tooltip>
                    ) : (
                      <RoundedOutlinedButton
                        onClick={() => {
                          onSelectFamily(family.id);
                        }}
                      >
                        Select
                      </RoundedOutlinedButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} className={classes.noResultsTableCell}>
                  No results found
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FamilySearchResultsTable;
