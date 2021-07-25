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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { FamilySearchResponse } from "api/types";
import RoundedOutlinedButton from "components/common/rounded-outlined-button/RoundedOutlinedButton";
import { DefaultFields } from "constants/DefaultFields";

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
};

const FamilySearchResultsTable = ({ families, onSelectFamily }: Props) => {
  const classes = useStyles();
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
                  <TableCell>{family.first_name}</TableCell>
                  <TableCell>{family.last_name}</TableCell>
                  <TableCell>{family.phone_number}</TableCell>
                  <TableCell>{family.email}</TableCell>
                  <TableCell>{family.num_children}</TableCell>
                  <TableCell className={classes.selectButtonTableCell}>
                    <RoundedOutlinedButton
                      onClick={() => {
                        onSelectFamily(family.id);
                      }}
                    >
                      Select
                    </RoundedOutlinedButton>
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
