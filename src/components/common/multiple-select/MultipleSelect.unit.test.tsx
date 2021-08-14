import React from "react";

import { ThemeProvider } from "@material-ui/core";
import { fireEvent, render } from "@testing-library/react";

import theme from "theme";

import MultipleSelect from "./MultipleSelect";

describe("StatusChip", () => {
  let onChange: () => void;
  let getAllByRole: any;
  let getByRole: any;

  beforeEach(() => {
    onChange = jest.fn(() => {});
    ({ getAllByRole, getByRole } = render(
      <ThemeProvider theme={theme}>
        <MultipleSelect
          compact
          dense
          id=""
          label="Pets"
          onChange={onChange}
          options={["dogs", "cats"]}
          value={`dogs\nfrogs`}
        />
      </ThemeProvider>
    ));
  });

  it("renders options and values as menu items", () => {
    fireEvent.mouseDown(getByRole("button"));
    const options = getAllByRole("option");
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent("frogs");
    expect(options[1]).toHaveTextContent("dogs");
    expect(options[2]).toHaveTextContent("cats");
  });

  it("calls onChange with a newline separated string when selecting a value", () => {
    fireEvent.mouseDown(getByRole("button"));
    const options = getAllByRole("option");
    fireEvent.click(options[2]);
    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(`dogs\nfrogs\ncats`);
  });

  it("calls onChange with a newline separated string when deselecting a value", () => {
    fireEvent.mouseDown(getByRole("button"));
    const options = getAllByRole("option");
    fireEvent.click(options[0]);
    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("dogs");
  });
});
