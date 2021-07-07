import React from "react";

import { render } from "@testing-library/react";

import EnrolmentStatus from "constants/EnrolmentStatus";

import StatusChip from "./StatusChip";

describe("StatusChip", () => {
  it("renders the status name", () => {
    const { getByText } = render(
      <StatusChip status={EnrolmentStatus.REGISTERED} />
    );
    expect(getByText(EnrolmentStatus.REGISTERED)).toBeInTheDocument();
  });
});
