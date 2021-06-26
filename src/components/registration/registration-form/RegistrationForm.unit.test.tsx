import React from "react";

import { fireEvent, render } from "@testing-library/react";

import { SessionDetailResponse } from "api/types";
import { DefaultFields } from "constants/DefaultFields";
import QuestionTypes from "constants/QuestionTypes";
import StudentRole from "constants/StudentRole";
import { DynamicFieldsContext } from "context/DynamicFieldsContext";

import RegistrationForm, { TestId } from "./RegistrationForm";

describe("when the registration form is opened", () => {
  let getByRole: any;
  let getByTestId: any;
  let getByText: any;
  const session: SessionDetailResponse = {
    classes: [],
    families: [],
    fields: [],
    id: 1,
    season: "Fall",
    start_date: "2021-09-01",
    year: 2021,
  };

  beforeEach(() => {
    ({ getByRole, getByTestId, getByText } = render(
      <RegistrationForm onSubmit={() => {}} session={session} />
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
});

const TEST_LAST_NAME = "Fish";
const TEST_PARENT_ADDRESS = "42 Wallaby Way";
const TEST_PARENT_CELL_NUMBER = "123";
const TEST_PARENT_DOB = "Jan 1 1990";
const TEST_PARENT_EMAIL = "marlin@test.com";
const TEST_PARENT_FIRST_NAME = "Marlin";
const TEST_PARENT_HOME_NUMBER = "456";
const TEST_PARENT_WORK_NUMBER = "789";
const TEST_CHILD_FIRST_NAME = "Nemo";
const TEST_CHILD_DOB = "Jan 1 2020";
const TEST_GUEST_FIRST_NAME = "Dory";
const TEST_GUEST_DOB = "Jan 1 2015";

const TEST_DYNAMIC_FIELD = {
  is_default: false,
  name: "DOB",
  question_type: QuestionTypes.TEXT,
  options: [],
};

const TEST_PARENT_DYNAMIC_FIELD = {
  id: 1,
  role: StudentRole.PARENT,
  ...TEST_DYNAMIC_FIELD,
};

const TEST_CHILD_DYNAMIC_FIELD = {
  id: 2,
  role: StudentRole.CHILD,
  ...TEST_DYNAMIC_FIELD,
};

const TEST_GUEST_DYNAMIC_FIELD = {
  id: 3,
  role: StudentRole.GUEST,
  ...TEST_DYNAMIC_FIELD,
};

describe("when text fields are submitted", () => {
  it("displays them as form fields", () => {
    const session: SessionDetailResponse = {
      classes: [],
      families: [],
      fields: [
        TEST_PARENT_DYNAMIC_FIELD.id,
        TEST_CHILD_DYNAMIC_FIELD.id,
        // guest field not included
      ],
      id: 1,
      season: "Fall",
      start_date: "2021-09-01",
      year: 2021,
    };
    const { getByTestId, queryByTestId } = render(
      <DynamicFieldsContext.Provider
        value={{
          parentDynamicFields: [TEST_PARENT_DYNAMIC_FIELD],
          childDynamicFields: [TEST_CHILD_DYNAMIC_FIELD],
          guestDynamicFields: [TEST_GUEST_DYNAMIC_FIELD],
        }}
      >
        <RegistrationForm onSubmit={() => {}} session={session} />
      </DynamicFieldsContext.Provider>
    );

    expect(
      getByTestId(`${StudentRole.PARENT} ${TEST_PARENT_DYNAMIC_FIELD.name}`)
    ).toBeInTheDocument();
    expect(
      getByTestId(`${StudentRole.CHILD} ${TEST_CHILD_DYNAMIC_FIELD.name}`)
    ).toBeInTheDocument();
    expect(
      queryByTestId(`${StudentRole.GUEST} ${TEST_GUEST_DYNAMIC_FIELD.name}`)
    ).not.toBeInTheDocument();
  });

  it("structures the data in the required format", () => {
    const session: SessionDetailResponse = {
      classes: [],
      families: [],
      fields: [
        TEST_PARENT_DYNAMIC_FIELD.id,
        TEST_CHILD_DYNAMIC_FIELD.id,
        TEST_GUEST_DYNAMIC_FIELD.id,
      ],
      id: 1,
      season: "Fall",
      start_date: "2021-09-01",
      year: 2021,
    };
    const onSubmit = jest.fn((e) => e.preventDefault());
    const { getByRole, getByTestId } = render(
      <DynamicFieldsContext.Provider
        value={{
          parentDynamicFields: [TEST_PARENT_DYNAMIC_FIELD],
          childDynamicFields: [TEST_CHILD_DYNAMIC_FIELD],
          guestDynamicFields: [TEST_GUEST_DYNAMIC_FIELD],
        }}
      >
        <RegistrationForm onSubmit={onSubmit} session={session} />
      </DynamicFieldsContext.Provider>
    );

    // basic information section
    fireEvent.change(
      getByTestId(`${StudentRole.PARENT} ${DefaultFields.FIRST_NAME.name}`),
      {
        target: { value: TEST_PARENT_FIRST_NAME },
      }
    );
    fireEvent.change(
      getByTestId(`${StudentRole.PARENT} ${DefaultFields.LAST_NAME.name}`),
      {
        target: { value: TEST_LAST_NAME },
      }
    );
    fireEvent.change(
      getByTestId(`${StudentRole.PARENT} ${DefaultFields.HOME_NUMBER.name}`),
      {
        target: { value: TEST_PARENT_HOME_NUMBER },
      }
    );
    fireEvent.change(
      getByTestId(`${StudentRole.PARENT} ${DefaultFields.CELL_NUMBER.name}`),
      {
        target: { value: TEST_PARENT_CELL_NUMBER },
      }
    );
    fireEvent.change(
      getByTestId(`${StudentRole.PARENT} ${DefaultFields.WORK_NUMBER.name}`),
      {
        target: { value: TEST_PARENT_WORK_NUMBER },
      }
    );
    fireEvent.change(
      getByTestId(`${StudentRole.PARENT} ${DefaultFields.EMAIL.name}`),
      {
        target: { value: TEST_PARENT_EMAIL },
      }
    );
    fireEvent.change(
      getByTestId(`${StudentRole.PARENT} ${DefaultFields.ADDRESS.name}`),
      {
        target: { value: TEST_PARENT_ADDRESS },
      }
    );
    fireEvent.change(
      getByTestId(`${StudentRole.PARENT} ${TEST_DYNAMIC_FIELD.name}`),
      {
        target: { value: TEST_PARENT_DOB },
      }
    );

    // children section
    fireEvent.change(
      getByTestId(`${StudentRole.CHILD} ${DefaultFields.FIRST_NAME.name}`),
      {
        target: { value: TEST_CHILD_FIRST_NAME },
      }
    );
    fireEvent.change(
      getByTestId(`${StudentRole.CHILD} ${DefaultFields.LAST_NAME.name}`),
      {
        target: { value: TEST_LAST_NAME },
      }
    );
    fireEvent.change(
      getByTestId(`${StudentRole.CHILD} ${TEST_DYNAMIC_FIELD.name}`),
      {
        target: { value: TEST_CHILD_DOB },
      }
    );

    // guest section
    fireEvent.click(getByRole("button", { name: "Add Guest" }));
    fireEvent.change(
      getByTestId(`${StudentRole.GUEST} ${DefaultFields.FIRST_NAME.name}`),
      {
        target: { value: TEST_GUEST_FIRST_NAME },
      }
    );
    fireEvent.change(
      getByTestId(`${StudentRole.GUEST} ${DefaultFields.LAST_NAME.name}`),
      {
        target: { value: TEST_LAST_NAME },
      }
    );
    fireEvent.change(
      getByTestId(`${StudentRole.GUEST} ${TEST_DYNAMIC_FIELD.name}`),
      {
        target: { value: TEST_GUEST_DOB },
      }
    );

    fireEvent.click(getByRole("button", { name: "Done" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "submit",
      }),
      {
        address: TEST_PARENT_ADDRESS,
        cell_number: TEST_PARENT_CELL_NUMBER,
        children: [
          {
            first_name: TEST_CHILD_FIRST_NAME,
            information: { [TEST_CHILD_DYNAMIC_FIELD.id]: TEST_CHILD_DOB },
            last_name: TEST_LAST_NAME,
          },
        ],
        email: TEST_PARENT_EMAIL,
        guests: [
          {
            first_name: TEST_GUEST_FIRST_NAME,
            information: { [TEST_GUEST_DYNAMIC_FIELD.id]: TEST_GUEST_DOB },
            last_name: TEST_LAST_NAME,
          },
        ],
        home_number: TEST_PARENT_HOME_NUMBER,
        parent: {
          first_name: TEST_PARENT_FIRST_NAME,
          information: { [TEST_PARENT_DYNAMIC_FIELD.id]: TEST_PARENT_DOB },
          last_name: TEST_LAST_NAME,
        },
        preferred_comms: "",
        preferred_number: "",
        work_number: TEST_PARENT_WORK_NUMBER,
      }
    );
  });
});
