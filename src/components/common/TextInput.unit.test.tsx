import React from "react";
import { fireEvent, render } from "@testing-library/react";
import TextInput from "./TextInput";

describe("TextInput", () => {
  let getByLabelText: any;
  let getByRole: any;
  let getByTestId: any;
  const testId = "Parent first name";
  const onChange = jest.fn();

  beforeEach(() => {
    ({ getByLabelText, getByRole, getByTestId } = render(
      <TextInput
        id="first-name"
        label="First name"
        value="Kermit"
        onChange={(value: string) => onChange(value)}
        testId={testId}
      />
    ));
  });

  it("renders a label", () => {
    expect(
      getByLabelText("First name", { selector: "input" })
    ).toBeInTheDocument();
  });

  it("has a text box", () => {
    expect(getByRole("textbox")).toBeInTheDocument();
  });

  it("has a test id", () => {
    expect(getByTestId(testId)).toBeInTheDocument();
  });

  it("has a value", () => {
    expect(getByRole("textbox")).toHaveValue("Kermit");
  });

  it("calls onChange when the input is changed", async () => {
    await fireEvent.change(getByRole("textbox"), {
      target: { value: "Elmo" },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("Elmo");
  });
});
