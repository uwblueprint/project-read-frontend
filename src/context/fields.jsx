import React, { useEffect, useState, createContext } from "react";
import PropTypes from "prop-types";
import FieldAPI from "../api/FieldAPI";

export const FieldsContext = createContext();

export const FieldsProvider = ({ values, children }) => {
  const [parentFields, setParentFields] = useState(
    values ? values.parentFields : []
  );
  const [childFields, setChildFields] = useState(
    values ? values.childFields : []
  );
  const [guestFields, setGuestFields] = useState(
    values ? values.guestFields : []
  );

  useEffect(() => {
    async function fetchFields() {
      const fields = await FieldAPI.getFields();
      if (fields.length) {
        setParentFields(fields[0].parent_fields);
        setChildFields(fields[0].child_fields);
        setGuestFields(fields[0].guest_fields);
      }
    }
    if (values === null) {
      fetchFields();
    }
  }, []);

  return (
    <FieldsContext.Provider value={{ parentFields, childFields, guestFields }}>
      {children}
    </FieldsContext.Provider>
  );
};

FieldsProvider.defaultProps = {
  values: null,
};

FieldsProvider.propTypes = {
  values: PropTypes.shape({
    parentFields: PropTypes.arrayOf(PropTypes.object).isRequired,
    childFields: PropTypes.arrayOf(PropTypes.object).isRequired,
    guestFields: PropTypes.arrayOf(PropTypes.object).isRequired,
  }),
  children: PropTypes.node.isRequired,
};
