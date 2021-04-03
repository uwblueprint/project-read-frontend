import React, { useEffect, useState, createContext } from "react";
import PropTypes from "prop-types";
import FieldAPI from "../api/FieldAPI";

export const FieldsContext = createContext();

export const FieldsProvider = ({ children }) => {
  const [parentFields, setParentFields] = useState([]);
  const [childFields, setChildFields] = useState([]);
  const [guestFields, setGuestFields] = useState([]);

  useEffect(() => {
    async function fetchFields() {
      const fields = await FieldAPI.getFields();
      if (fields.length) {
        setParentFields(fields[0].parent_fields);
        setChildFields(fields[0].child_fields);
        setGuestFields(fields[0].guest_fields);
      }
    }
    fetchFields();
  }, []);

  return (
    <FieldsContext.Provider value={{ parentFields, childFields, guestFields }}>
      {children}
    </FieldsContext.Provider>
  );
};

FieldsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
