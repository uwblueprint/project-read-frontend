import React from "react";
import PropTypes from "prop-types";
import FormField from "./FormField";

function useFormFields(fields) {
  const [formFields, setFormFields] = React.useState(
    Object.assign({}, ...fields.map((field) => ({ [field.id]: "" })))
  );

  const createChangeHandler = (key) => (e) => {
    const { value } = e.target;
    setFormFields((prev) => ({ ...prev, [key]: value }));
  };

  return { formFields, createChangeHandler };
}

function FormFieldGroup({ fields }) {
  const { formFields, createChangeHandler } = useFormFields(fields);

  return (
    <>
      {fields.map((field) => (
        <div key={field.id}>
          <FormField
            field={field}
            initialValue={formFields[field.id]}
            onChange={createChangeHandler(field.id)}
          />
        </div>
      ))}
    </>
  );
}

FormFieldGroup.propTypes = {
  fields: PropTypes.arrayOf(FormField.propTypes.field).isRequired,
};

export default FormFieldGroup;
