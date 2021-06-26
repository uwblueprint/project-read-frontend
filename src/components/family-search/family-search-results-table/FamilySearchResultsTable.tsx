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
import { FamilySearchResponse } from "../../../api/FamilyAPI";

const useStyles = makeStyles(() => ({
  noResultsTableCell: {
    textAlign: "center",
  },
}));

type Props = {
  families: FamilySearchResponse[];
};

const FamilySearchResultsTable = ({ families }: Props) => {
  const classes = useStyles();
  return (
    <Box marginY={2} maxHeight={350}>
      <TableContainer component={Paper} elevation={0}>
        <Table stickyHeader aria-label="family search results table">
          <caption hidden>Family search results</caption>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Primary Phone Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell># of Children</TableCell>
            </TableRow>
          </TableHead>
          {families.length ? (
            <TableBody>
              {families.map((family) => (
                <TableRow>
                  <TableCell>{family.first_name}</TableCell>
                  <TableCell>{family.last_name}</TableCell>
                  <TableCell>{family.phone_number}</TableCell>
                  <TableCell>{family.email}</TableCell>
                  <TableCell>{family.num_children}</TableCell>
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
