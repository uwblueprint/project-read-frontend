import React from "react";

import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { fireEvent, render } from "@testing-library/react";

import CreateSession from "./CreateSession";

describe("CreateSession", () => {
  let getByRole: any;

  beforeEach(() => {
    ({ getByRole } = render(
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <CreateSession />
      </MuiPickersUtilsProvider>
    ));
  });

  describe("when on the session config (first) step", () => {
    it("renders the step title", () => {
      expect(
        getByRole("heading", { name: "Create a new session" })
      ).toBeInTheDocument();
    });

    it("disables the back button", () => {
      expect(getByRole("button", { name: "Back" })).toBeDisabled();
    });

    it("renders the next button", () => {
      expect(getByRole("button", { name: "Next" })).toBeInTheDocument();
    });
  });

  describe("when on the registration form (second) step", () => {
    beforeEach(async () => {
      await fireEvent.click(getByRole("button", { name: "Next" }));
    });

    it("renders the step title", () => {
      expect(
        getByRole("heading", { name: "Create the client registration form" })
      ).toBeInTheDocument();
    });

    it("can go back to the previous step", async () => {
      await fireEvent.click(getByRole("button", { name: "Back" }));
      expect(
        getByRole("heading", { name: "Create a new session" })
      ).toBeInTheDocument();
    });

    it("renders the next button", () => {
      expect(getByRole("button", { name: "Next" })).toBeInTheDocument();
    });
  });

  describe("when on the registration form (third) step", () => {
    beforeEach(async () => {
      await fireEvent.click(getByRole("button", { name: "Next" }));
      await fireEvent.click(getByRole("button", { name: "Next" }));
    });

    it("renders the step title", () => {
      expect(getByRole("heading", { name: "Add classes" })).toBeInTheDocument();
    });

    it("can go back to the previous step", async () => {
      await fireEvent.click(getByRole("button", { name: "Back" }));
      expect(
        getByRole("heading", { name: "Create the client registration form" })
      ).toBeInTheDocument();
    });

    it("renders the finish button", () => {
      expect(getByRole("button", { name: "Finish" })).toBeInTheDocument();
    });
  });
});
