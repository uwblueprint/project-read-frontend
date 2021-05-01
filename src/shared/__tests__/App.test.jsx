import React from "react";
import { render } from "@testing-library/react";
import App from "../App";

it("checks that the app loads", () => {
  const { getByText } = render(<App />);
  expect(getByText("Please Sign In")).toBeInTheDocument();
});
