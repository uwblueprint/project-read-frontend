import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import FormField from "./FormField";

function useFormFields(fields) {
  const [formFields, setFormFields] = useState(
    Object.assign({}, ...fields.map((field) => ({ [field.id]: "" })))
  );

  const createFieldChangeHandler = (key) => (e) => {
    const { value } = e.target;
    setFormFields((prev) => ({ ...prev, [key]: value }));
  };

  return { formFields, createFieldChangeHandler };
}

function FormFieldGroup({ fields, onChange }) {
  const { formFields, createFieldChangeHandler } = useFormFields(
    fields,
    onChange
  );

  useEffect(() => {
    onChange(formFields);
  }, [formFields]);

  return (
    <>
      {fields.map((field) => (
        <div key={field.id}>
          <FormField
            field={field}
            initialValue={formFields[field.id]}
            onChange={createFieldChangeHandler(field.id)}
          />
        </div>
      ))}
    </>
  );
}

FormFieldGroup.propTypes = {
  fields: PropTypes.arrayOf(FormField.propTypes.field).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FormFieldGroup;
