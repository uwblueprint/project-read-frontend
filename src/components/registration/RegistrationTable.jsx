import React from "react";
import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";

const columns = [
  { name: "email", label: "Email", options: { filter: false } },
  { name: "phone_number", label: "Phone Number", options: { filter: false } },
  {
    name: "preferred_comms",
    label: "Preferred Communication Method",
    options: { searchable: false },
  },
];

const options = {
  selectableRows: "none",
};

function RegistrationTable({ data }) {
  return <MUIDataTable data={data} columns={columns} options={options} />;
}

RegistrationTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default RegistrationTable;
