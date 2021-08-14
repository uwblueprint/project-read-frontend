import React from "react";

import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { fireEvent, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment from "moment";

import EnrolmentAPI from "api/EnrolmentAPI";
import FamilyAPI from "api/FamilyAPI";
import {
  EnrolmentResponse,
  FamilyDetailResponse,
  SessionDetailResponse,
} from "api/types";
import RegistrationForm, {
  TestId,
} from "components/registration/registration-form/RegistrationForm";
import DefaultFields from "constants/DefaultFields";
import EnrolmentStatus from "constants/EnrolmentStatus";
import StudentRole from "constants/StudentRole";
import { DynamicFieldsContext } from "context/DynamicFieldsContext";

import {
  TestValue,
  TEST_CHILD_DYNAMIC_FIELD,
  TEST_DYNAMIC_FIELD,
  TEST_GUEST_DYNAMIC_FIELD,
  TEST_PARENT_DYNAMIC_FIELD,
  TEST_SESSION_DYNAMIC_FIELD,
} from "./constants";

describe("RegistrationForm", () => {
  it("creates a family and enrolment when registering a new family", async () => {
    jest.spyOn(FamilyAPI, "postFamily").mockResolvedValue({
      id: 1,
      parent: {
        id: 2,
      },
    } as FamilyDetailResponse);
    jest
      .spyOn(EnrolmentAPI, "postEnrolment")
      .mockResolvedValue({} as EnrolmentResponse);

    const session: SessionDetailResponse = {
      classes: [
        { id: 1, name: "Class 1", colour: "FFFFFF" },
        { id: 2, name: "Class 2", colour: "FFFFFF" },
      ],
      families: [],
      fields: [
        TEST_PARENT_DYNAMIC_FIELD.id,
        TEST_CHILD_DYNAMIC_FIELD.id,
        TEST_GUEST_DYNAMIC_FIELD.id,
        TEST_SESSION_DYNAMIC_FIELD.id,
      ],
      id: 1,
      name: "Fall 2021",
      start_date: "2021-09-01",
    };
    const onRegister = jest.fn(() => {});
    const { getByLabelText, getByRole, getByTestId } = render(
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DynamicFieldsContext.Provider
          value={{
            parentDynamicFields: [TEST_PARENT_DYNAMIC_FIELD],
            childDynamicFields: [TEST_CHILD_DYNAMIC_FIELD],
            guestDynamicFields: [TEST_GUEST_DYNAMIC_FIELD],
            sessionDynamicFields: [TEST_SESSION_DYNAMIC_FIELD],
          }}
        >
          <RegistrationForm
            existingFamily={null}
            onRegister={onRegister}
            session={session}
          />
        </DynamicFieldsContext.Provider>
      </MuiPickersUtilsProvider>
    );

    // basic information section
    fireEvent.change(
      getByTestId(`${StudentRole.PARENT} ${DefaultFields.FIRST_NAME.name}`),
      {
        target: { value: TestValue.ParentFirstName },
      }
    );
    fireEvent.change(
      getByTestId(`${StudentRole.PARENT} ${DefaultFields.LAST_NAME.name}`),
      {
        target: { value: TestValue.LastName },
      }
    );

    const parentDobInput = getByLabelText(
      `${StudentRole.PARENT} ${DefaultFields.DATE_OF_BIRTH.name}`
    ) as HTMLInputElement;
    parentDobInput.setSelectionRange(0, parentDobInput.value.length);
    userEvent.type(parentDobInput, TestValue.ParentDob);

    fireEvent.change(
      getByTestId(`${StudentRole.PARENT} ${DefaultFields.HOME_NUMBER.name}`),
      {
        target: { value: TestValue.HomeNumber },
      }
    );
    fireEvent.change(
      getByTestId(`${StudentRole.PARENT} ${DefaultFields.CELL_NUMBER.name}`),
      {
        target: { value: TestValue.CellNumber },
      }
    );
    fireEvent.change(
      getByTestId(`${StudentRole.PARENT} ${DefaultFields.WORK_NUMBER.name}`),
      {
        target: { value: TestValue.WorkNumber },
      }
    );
    fireEvent.change(
      getByTestId(`${StudentRole.PARENT} ${DefaultFields.EMAIL.name}`),
      {
        target: { value: TestValue.Email },
      }
    );
    fireEvent.change(
      getByTestId(`${StudentRole.PARENT} ${DefaultFields.ADDRESS.name}`),
      {
        target: { value: TestValue.Address },
      }
    );
    fireEvent.change(
      getByTestId(`${StudentRole.PARENT} ${TEST_DYNAMIC_FIELD.name}`),
      {
        target: { value: TestValue.ParentFavouriteColour },
      }
    );

    // children section
    fireEvent.change(
      getByTestId(`${StudentRole.CHILD} ${DefaultFields.FIRST_NAME.name}`),
      {
        target: { value: TestValue.ChildFirstName },
      }
    );
    fireEvent.change(
      getByTestId(`${StudentRole.CHILD} ${DefaultFields.LAST_NAME.name}`),
      {
        target: { value: TestValue.LastName },
      }
    );

    const childDobInput = getByLabelText(
      `${StudentRole.CHILD} ${DefaultFields.DATE_OF_BIRTH.name}`
    ) as HTMLInputElement;
    childDobInput.setSelectionRange(0, childDobInput.value.length);
    userEvent.type(childDobInput, TestValue.ChildDob);

    fireEvent.change(
      getByTestId(`${StudentRole.CHILD} ${TEST_DYNAMIC_FIELD.name}`),
      {
        target: { value: TestValue.ChildFavouriteColour },
      }
    );

    // guest section
    fireEvent.click(getByRole("button", { name: "Add member" }));
    fireEvent.change(
      getByTestId(`${StudentRole.GUEST} ${DefaultFields.FIRST_NAME.name}`),
      {
        target: { value: TestValue.GuestFirstName },
      }
    );
    fireEvent.change(
      getByTestId(`${StudentRole.GUEST} ${DefaultFields.LAST_NAME.name}`),
      {
        target: { value: TestValue.LastName },
      }
    );

    const guestDobInput = getByLabelText(
      `${StudentRole.GUEST} ${DefaultFields.DATE_OF_BIRTH.name}`
    ) as HTMLInputElement;
    guestDobInput.setSelectionRange(0, guestDobInput.value.length);
    userEvent.type(guestDobInput, TestValue.GuestDob);

    fireEvent.change(
      getByTestId(`${StudentRole.GUEST} ${TEST_DYNAMIC_FIELD.name}`),
      {
        target: { value: TestValue.GuestFavouriteColour },
      }
    );

    // session section
    fireEvent.change(getByTestId(TestId.PreferredClassSelect), {
      target: { value: session.classes[1].id },
    });

    fireEvent.change(
      getByTestId(`${StudentRole.PARENT} ${TEST_SESSION_DYNAMIC_FIELD.name}`),
      {
        target: { value: TestValue.TimeInCanada },
      }
    );

    fireEvent.change(getByTestId(TestId.StatusSelect), {
      target: { value: EnrolmentStatus.SIGNED_UP },
    });

    fireEvent.change(getByTestId(TestId.NotesInput), {
      target: { value: TestValue.Notes },
    });

    fireEvent.click(getByRole("button", { name: "Done" }));

    await waitFor(() => expect(FamilyAPI.postFamily).toHaveBeenCalledTimes(1));
    expect(FamilyAPI.postFamily).toHaveBeenCalledWith({
      address: TestValue.Address,
      cell_number: TestValue.CellNumber,
      children: [
        {
          date_of_birth: moment(TestValue.ChildDob, "MMDDYYYY").format(
            "YYYY-MM-DD"
          ),
          first_name: TestValue.ChildFirstName,
          information: {
            [TEST_CHILD_DYNAMIC_FIELD.id]: TestValue.ChildFavouriteColour,
          },
          last_name: TestValue.LastName,
        },
      ],
      email: TestValue.Email,
      guests: [
        {
          date_of_birth: moment(TestValue.GuestDob, "MMDDYYYY").format(
            "YYYY-MM-DD"
          ),
          first_name: TestValue.GuestFirstName,
          information: {
            [TEST_GUEST_DYNAMIC_FIELD.id]: TestValue.GuestFavouriteColour,
          },
          last_name: TestValue.LastName,
        },
      ],
      home_number: TestValue.HomeNumber,
      interactions: [],
      notes: TestValue.Notes,
      parent: {
        date_of_birth: moment(TestValue.ParentDob, "MMDDYYYY").format(
          "YYYY-MM-DD"
        ),
        first_name: TestValue.ParentFirstName,
        information: {
          [TEST_PARENT_DYNAMIC_FIELD.id]: TestValue.ParentFavouriteColour,
          [TEST_SESSION_DYNAMIC_FIELD.id]: TestValue.TimeInCanada,
        },
        last_name: TestValue.LastName,
      },
      preferred_comms: "",
      preferred_number: "",
      work_number: TestValue.WorkNumber,
    });

    await waitFor(() =>
      expect(EnrolmentAPI.postEnrolment).toHaveBeenCalledTimes(1)
    );
    expect(EnrolmentAPI.postEnrolment).toHaveBeenCalledWith({
      enrolled_class: null,
      family: 1,
      preferred_class: session.classes[1].id,
      session: session.id,
      status: EnrolmentStatus.SIGNED_UP,
      students: [2],
    });

    expect(onRegister).toHaveBeenCalledTimes(1);
  });
});
