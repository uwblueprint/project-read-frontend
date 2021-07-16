import React from "react";

import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { fireEvent, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment from "moment";

import FamilyAPI from "api/FamilyAPI";
import { SessionDetailResponse } from "api/types";
import { DefaultFields } from "constants/DefaultFields";
import QuestionType from "constants/QuestionType";
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
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <RegistrationForm
          existingFamily={null}
          onSubmit={() => {}}
          session={session}
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
});

const TEST_LAST_NAME = "Fish";

const TEST_PARENT_ADDRESS = "42 Wallaby Way";
const TEST_PARENT_CELL_NUMBER = "123";
const TEST_PARENT_DOB = "01011990";
const TEST_PARENT_EMAIL = "marlin@test.com";
const TEST_PARENT_FAV_COLOUR = "red";
const TEST_PARENT_FIRST_NAME = "Marlin";
const TEST_PARENT_HOME_NUMBER = "456";
const TEST_PARENT_WORK_NUMBER = "789";

const TEST_CHILD_FAV_COLOUR = "blue";
const TEST_CHILD_FIRST_NAME = "Nemo";
const TEST_CHILD_DOB = "01012018";

const TEST_GUEST_FAV_COLOUR = "periwinkle";
const TEST_GUEST_FIRST_NAME = "Dory";
const TEST_GUEST_DOB = "01011987";

const TEST_DYNAMIC_FIELD = {
  is_default: false,
  name: "Favourite colour",
  question_type: QuestionType.TEXT,
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
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DynamicFieldsContext.Provider
          value={{
            parentDynamicFields: [TEST_PARENT_DYNAMIC_FIELD],
            childDynamicFields: [TEST_CHILD_DYNAMIC_FIELD],
            guestDynamicFields: [TEST_GUEST_DYNAMIC_FIELD],
          }}
        >
          <RegistrationForm
            existingFamily={null}
            onSubmit={() => {}}
            session={session}
          />
        </DynamicFieldsContext.Provider>
      </MuiPickersUtilsProvider>
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

  it("structures the data in the required format", async () => {
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

    jest.spyOn(FamilyAPI, "postFamily").mockResolvedValue({});
    const onSubmit = jest.fn(() => {});
    const { getByLabelText, getByRole, getByTestId } = render(
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DynamicFieldsContext.Provider
          value={{
            parentDynamicFields: [TEST_PARENT_DYNAMIC_FIELD],
            childDynamicFields: [TEST_CHILD_DYNAMIC_FIELD],
            guestDynamicFields: [TEST_GUEST_DYNAMIC_FIELD],
          }}
        >
          <RegistrationForm
            existingFamily={null}
            onSubmit={onSubmit}
            session={session}
          />
        </DynamicFieldsContext.Provider>
      </MuiPickersUtilsProvider>
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

    const parentDobInput = getByLabelText(
      `${StudentRole.PARENT} ${DefaultFields.DATE_OF_BIRTH.name}`
    ) as HTMLInputElement;
    parentDobInput.setSelectionRange(0, parentDobInput.value.length);
    userEvent.type(parentDobInput, TEST_PARENT_DOB);

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
        target: { value: TEST_PARENT_FAV_COLOUR },
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

    const childDobInput = getByLabelText(
      `${StudentRole.CHILD} ${DefaultFields.DATE_OF_BIRTH.name}`
    ) as HTMLInputElement;
    childDobInput.setSelectionRange(0, childDobInput.value.length);
    userEvent.type(childDobInput, TEST_CHILD_DOB);

    fireEvent.change(
      getByTestId(`${StudentRole.CHILD} ${TEST_DYNAMIC_FIELD.name}`),
      {
        target: { value: TEST_CHILD_FAV_COLOUR },
      }
    );

    // guest section
    fireEvent.click(getByRole("button", { name: "Add member" }));
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

    const guestDobInput = getByLabelText(
      `${StudentRole.GUEST} ${DefaultFields.DATE_OF_BIRTH.name}`
    ) as HTMLInputElement;
    guestDobInput.setSelectionRange(0, guestDobInput.value.length);
    userEvent.type(guestDobInput, TEST_GUEST_DOB);

    fireEvent.change(
      getByTestId(`${StudentRole.GUEST} ${TEST_DYNAMIC_FIELD.name}`),
      {
        target: { value: TEST_GUEST_FAV_COLOUR },
      }
    );

    fireEvent.click(getByRole("button", { name: "Done" }));

    await waitFor(() => expect(FamilyAPI.postFamily).toHaveBeenCalledTimes(1));
    expect(FamilyAPI.postFamily).toHaveBeenCalledWith({
      address: TEST_PARENT_ADDRESS,
      cell_number: TEST_PARENT_CELL_NUMBER,
      children: [
        {
          date_of_birth: moment(TEST_CHILD_DOB, "MMDDYYYY").format(
            "YYYY-MM-DD"
          ),
          first_name: TEST_CHILD_FIRST_NAME,
          information: { [TEST_CHILD_DYNAMIC_FIELD.id]: TEST_CHILD_FAV_COLOUR },
          last_name: TEST_LAST_NAME,
        },
      ],
      email: TEST_PARENT_EMAIL,
      guests: [
        {
          date_of_birth: moment(TEST_GUEST_DOB, "MMDDYYYY").format(
            "YYYY-MM-DD"
          ),
          first_name: TEST_GUEST_FIRST_NAME,
          information: { [TEST_GUEST_DYNAMIC_FIELD.id]: TEST_GUEST_FAV_COLOUR },
          last_name: TEST_LAST_NAME,
        },
      ],
      home_number: TEST_PARENT_HOME_NUMBER,
      parent: {
        date_of_birth: moment(TEST_PARENT_DOB, "MMDDYYYY").format("YYYY-MM-DD"),
        first_name: TEST_PARENT_FIRST_NAME,
        information: { [TEST_PARENT_DYNAMIC_FIELD.id]: TEST_PARENT_FAV_COLOUR },
        last_name: TEST_LAST_NAME,
      },
      preferred_comms: "",
      preferred_number: "",
      work_number: TEST_PARENT_WORK_NUMBER,
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
