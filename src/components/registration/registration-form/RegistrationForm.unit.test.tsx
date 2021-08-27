import React from "react";

import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { render } from "@testing-library/react";

import { SessionDetailResponse } from "api/types";
import StudentRole from "constants/StudentRole";
import { DynamicFieldsContext } from "context/DynamicFieldsContext";
import {
  TEST_CHILD_DYNAMIC_FIELD,
  TEST_GUEST_DYNAMIC_FIELD,
  TEST_PARENT_DYNAMIC_FIELD,
  TEST_SESSION_DYNAMIC_FIELD,
} from "tests/registration/constants";

import RegistrationForm, { TestId } from "./RegistrationForm";

describe("when the registration form is opened", () => {
  let getByRole: any;
  let getByTestId: any;
  let getByText: any;
  let queryByTestId: any;

  beforeEach(() => {
    ({ getByRole, getByTestId, getByText } = render(
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <RegistrationForm
          existingFamily={null}
          onRegister={() => {}}
          session={{
            classes: [],
            families: [],
            fields: [],
            id: 1,
            name: "Fall 2021",
            start_date: "2021-09-01",
          }}
        />
      </MuiPickersUtilsProvider>
    ));
  });

  it("renders the form", () => {
    expect(getByTestId(TestId.RegistrationForm)).toBeInTheDocument();
  });

  it("displays the session name", () => {
    expect(getByTestId(TestId.SessionLabel)).toHaveTextContent(
      "Currently enrolling a new family for Fall 2021"
    );
  });

  it("renders the basic information section", () => {
    expect(getByText("Basic information")).toBeInTheDocument();
  });

  it("renders the children section", () => {
    expect(getByText("Children")).toBeInTheDocument();
  });

  it("renders the family members section", () => {
    expect(getByText("Family members")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    expect(getByRole("button", { name: "Done" })).toBeInTheDocument();
  });

  it("displays provided fields as form inputs", () => {
    const session: SessionDetailResponse = {
      classes: [],
      families: [],
      fields: [
        TEST_PARENT_DYNAMIC_FIELD.id,
        TEST_CHILD_DYNAMIC_FIELD.id,
        // guest field not included
        TEST_SESSION_DYNAMIC_FIELD.id,
      ],
      id: 1,
      name: "Fall 2021",
      start_date: "2021-09-01",
    };
    ({ getByTestId, queryByTestId } = render(
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DynamicFieldsContext.Provider
          value={{
            dynamicFields: {
              parentDynamicFields: [TEST_PARENT_DYNAMIC_FIELD],
              childDynamicFields: [TEST_CHILD_DYNAMIC_FIELD],
              guestDynamicFields: [TEST_GUEST_DYNAMIC_FIELD],
              sessionDynamicFields: [TEST_SESSION_DYNAMIC_FIELD],
            },
            fetchDynamicFields: () => {},
          }}
        >
          <RegistrationForm
            existingFamily={null}
            onRegister={() => {}}
            session={session}
          />
        </DynamicFieldsContext.Provider>
      </MuiPickersUtilsProvider>
    ));

    expect(
      getByTestId(`${StudentRole.PARENT} ${TEST_PARENT_DYNAMIC_FIELD.name}`)
    ).toBeInTheDocument();
    expect(
      getByTestId(`${StudentRole.CHILD} ${TEST_CHILD_DYNAMIC_FIELD.name}`)
    ).toBeInTheDocument();
    expect(
      queryByTestId(`${StudentRole.GUEST} ${TEST_GUEST_DYNAMIC_FIELD.name}`)
    ).not.toBeInTheDocument();
    expect(
      getByTestId(`${StudentRole.SESSION} ${TEST_SESSION_DYNAMIC_FIELD.name}`)
    ).toBeInTheDocument();
  });
});
