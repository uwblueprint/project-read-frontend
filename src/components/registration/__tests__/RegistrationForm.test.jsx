import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { ThemeProvider } from "@material-ui/styles";
import { FieldsProvider } from "../../../context/fields";
import theme from "../../../theme";
import RegistrationForm from "../RegistrationForm";
import StudentRoles from "../../../constants/StudentRoles";
import QuestionTypes from "../../../constants/QuestionTypes";

const TEST_FIELD = {
  id: "DOB",
  name: "DOB",
  question_type: QuestionTypes.TEXT,
};
const TEST_LAST_NAME = "Fish";
const TEST_PARENT_FIRST_NAME = "Marlin";
const TEST_PARENT_EMAIL = "marlin@test.com";
const TEST_PARENT_PREFERRED_CONTACT = "none";
const TEST_PARENT_DOB = "Jan 1 1990";
const TEST_CHILD_FIRST_NAME = "Nemo";
const TEST_CHILD_DOB = "Jan 1 2020";
const TEST_GUEST_FIRST_NAME = "Dory";
const TEST_GUEST_DOB = "Jan 1 2015";

it("submits the registration form", () => {
  const onSubmit = jest.fn();
  const { getByText, getByTestId } = render(
    <ThemeProvider theme={theme}>
      <FieldsProvider
        values={{
          parentFields: [{ ...TEST_FIELD, role: StudentRoles.PARENT }],
          childFields: [{ ...TEST_FIELD, role: StudentRoles.CHILD }],
          guestFields: [{ ...TEST_FIELD, role: StudentRoles.GUEST }],
        }}
      >
        <RegistrationForm onSubmit={onSubmit} />
      </FieldsProvider>
    </ThemeProvider>
  );

  expect(getByText("Basic information")).toBeInTheDocument();
  fireEvent.change(getByTestId("Parent First name"), {
    target: { value: TEST_PARENT_FIRST_NAME },
  });
  fireEvent.change(getByTestId("Parent Last name"), {
    target: { value: TEST_LAST_NAME },
  });
  fireEvent.change(getByTestId("Parent Email"), {
    target: { value: TEST_PARENT_EMAIL },
  });
  fireEvent.change(getByTestId("Parent Preferred Contact"), {
    target: { value: TEST_PARENT_PREFERRED_CONTACT },
  });
  fireEvent.change(getByTestId("Parent DOB"), {
    target: { value: TEST_PARENT_DOB },
  });

  expect(getByText("Children")).toBeInTheDocument();
  fireEvent.change(getByTestId("Child First name"), {
    target: { value: TEST_CHILD_FIRST_NAME },
  });
  fireEvent.change(getByTestId("Child Last name"), {
    target: { value: TEST_LAST_NAME },
  });
  fireEvent.change(getByTestId("Child DOB"), {
    target: { value: TEST_CHILD_DOB },
  });

  expect(getByText("Family members")).toBeInTheDocument();
  fireEvent.change(getByTestId("Guest First name"), {
    target: { value: TEST_GUEST_FIRST_NAME },
  });
  fireEvent.change(getByTestId("Guest Last name"), {
    target: { value: TEST_LAST_NAME },
  });
  fireEvent.change(getByTestId("Guest DOB"), {
    target: { value: TEST_GUEST_DOB },
  });

  fireEvent.submit(getByTestId("form"));

  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(onSubmit).toHaveBeenCalledWith({
    cell_number: "",
    children: [
      {
        first_name: TEST_CHILD_FIRST_NAME,
        information: { DOB: TEST_CHILD_DOB },
        last_name: TEST_LAST_NAME,
      },
    ],
    email: TEST_PARENT_EMAIL,
    guests: [
      {
        first_name: TEST_GUEST_FIRST_NAME,
        information: { DOB: TEST_GUEST_DOB },
        last_name: TEST_LAST_NAME,
      },
    ],
    home_number: "",
    parent: {
      first_name: TEST_PARENT_FIRST_NAME,
      information: { DOB: TEST_PARENT_DOB },
      last_name: TEST_LAST_NAME,
    },
    preferred_comms: TEST_PARENT_PREFERRED_CONTACT,
    preferred_number: "",
    work_number: "",
  });
});
