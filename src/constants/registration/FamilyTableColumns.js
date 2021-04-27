import DefaultFields from "../DefaultFields";

const FamilyTableColumns = [
  {
    name: DefaultFields.ID.name,
    label: DefaultFields.ID.label,
    options: { display: "excluded" },
  },
  {
    name: DefaultFields.FIRST_NAME.name,
    label: DefaultFields.FIRST_NAME.label,
    options: { filter: false },
  },
  {
    name: DefaultFields.LAST_NAME.name,
    label: DefaultFields.LAST_NAME.label,
    options: { filter: false },
  },
  {
    name: DefaultFields.EMAIL.name,
    label: DefaultFields.EMAIL.label,
    options: { filter: false },
  },
  {
    name: DefaultFields.PHONE.name,
    label: DefaultFields.PHONE.label,
    options: { filter: false },
  },
  {
    name: DefaultFields.NUM_CHILDREN.name,
    label: DefaultFields.NUM_CHILDREN.label,
    options: { searchable: false, filterOptions: { fullWidth: true } },
  },
  {
    name: DefaultFields.PREFERRED_CONTACT.name,
    label: DefaultFields.PREFERRED_CONTACT.label,
    options: { searchable: false, filterOptions: { fullWidth: true } },
  },
];

export default FamilyTableColumns;
