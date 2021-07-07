import React from "react";

import { fireEvent, render } from "@testing-library/react";

import SelectInput from "./SelectInput";

describe("SelectInput", () => {
  let getAllByLabelText: any;
  let getByRole: any;
  let getByTestId: any;
  let getByText: any;
  const testId = "Parent preferred contact";
  const onChange = jest.fn();

  beforeEach(() => {
    ({ getAllByLabelText, getByRole, getByTestId, getByText } = render(
      <SelectInput
        id="id"
        label="Preferred contact"
        value="Phone"
        onChange={(value) => onChange(value)}
        options={["Phone", "Email", "Text"]}
        testId={testId}
      />
    ));
  });

  it("renders a label", () => {
    expect(getAllByLabelText("Preferred contact")).not.toBeNull();
  });

  it("renders a clickable select", () => {
    expect(getByRole("button")).toBeInTheDocument();
  });

  it("has a test id", async () => {
    expect(getByTestId(testId)).toBeInTheDocument();
  });

  it("has a value", () => {
    expect(getByTestId(testId)).toHaveValue("Phone");
  });

  it("calls onChange when the input is changed", async () => {
    await fireEvent.change(getByTestId(testId), {
      target: { value: "Email" },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("Email");
  });

  it("renders the unselected options when clicked", async () => {
    fireEvent.keyDown(getByRole("button"), { key: "ArrowDown" });
    expect(getByText("Email")).toBeInTheDocument();
    expect(getByText("Text")).toBeInTheDocument();
  });
});
