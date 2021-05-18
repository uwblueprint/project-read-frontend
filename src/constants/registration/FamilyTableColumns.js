import { DefaultFields } from "../DefaultFields";

const FamilyTableColumns = [
  {
    name: DefaultFields.ID.id,
    label: DefaultFields.ID.name,
    options: { display: "excluded" },
  },
  {
    name: DefaultFields.FIRST_NAME.id,
    label: DefaultFields.FIRST_NAME.name,
    options: { filter: false },
  },
  {
    name: DefaultFields.LAST_NAME.id,
    label: DefaultFields.LAST_NAME.name,
    options: { filter: false },
  },
  {
    name: DefaultFields.EMAIL.id,
    label: DefaultFields.EMAIL.name,
    options: { filter: false },
  },
  {
    name: DefaultFields.PHONE.id,
    label: DefaultFields.PHONE.name,
    options: { filter: false },
  },
  {
    name: DefaultFields.NUM_CHILDREN.id,
    label: DefaultFields.NUM_CHILDREN.name,
    options: { searchable: false, filterOptions: { fullWidth: true } },
  },
  {
    name: DefaultFields.PREFERRED_CONTACT.id,
    label: DefaultFields.PREFERRED_CONTACT.name,
    options: { searchable: false, filterOptions: { fullWidth: true } },
  },
];

export default FamilyTableColumns;