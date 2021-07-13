import React from "react";

import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { fireEvent, render } from "@testing-library/react";

import { TestId as DateInputTestId } from "components/common/date-input/DateInput";

import SessionConfig, { TestId } from "./SessionConfig";

describe("SessionConfig", () => {
  let getByTestId: any;
  let getByText: any;
  const onChangeSessionName = jest.fn();
  const onChangeStartDate = jest.fn();

  beforeEach(() => {
    ({ getByTestId, getByText } = render(
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <SessionConfig
          sessionName="Fall 2020"
          onChangeSessionName={onChangeSessionName}
          startDate={new Date(2020, 9, 1)}
          onChangeStartDate={onChangeStartDate}
        />
      </MuiPickersUtilsProvider>
    ));
  });

  it("renders the page title", () => {
    expect(getByText("Session information")).toBeInTheDocument();
  });

  it("displays the session name in the name input", async () => {
    expect(getByTestId(TestId.NameInput)).toHaveValue("Fall 2020");
  });

  it("updates the name when the name is edited", async () => {
    await fireEvent.change(getByTestId(TestId.NameInput), {
      target: { value: "Fall 2020 - GSL for Families" },
    });
    expect(onChangeSessionName).toHaveBeenCalledTimes(1);
    expect(onChangeSessionName).toHaveBeenCalledWith(
      "Fall 2020 - GSL for Families"
    );
  });

  it("displays the start date in the date input", async () => {
    expect(getByTestId(DateInputTestId.Input)).toHaveValue("10/01/2020");
  });

  it("updates the start date when a new date is picked", async () => {
    await fireEvent.click(getByTestId(DateInputTestId.KeyboardButton));
    await fireEvent.click(await getByText("2"));
    expect(onChangeStartDate).toHaveBeenCalledTimes(1);
    expect(onChangeStartDate).toHaveBeenCalledWith("2020-10-02");
  });
});
