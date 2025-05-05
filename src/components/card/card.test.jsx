import React from "react";
import Card from "./card";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

describe("Card Component", () => {
  it("renders with name and value when loading is false", () => {
    render(
      <MemoryRouter>
        <Card name="Commits" value={42} path="/commits" loading={false} />
      </MemoryRouter>
    );

    expect(screen.getByText("Commits")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText(/See detailed view/i)).toBeInTheDocument();
  });

  it("shows skeleton when loading is true", () => {
    render(
      <MemoryRouter>
        <Card name="Commits" loading={true} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("progressbar")).toBeInTheDocument();
  });

  it("does not render link if path is not provided", () => {
    render(
      <MemoryRouter>
        <Card name="Contributors" value={100} loading={false} />
      </MemoryRouter>
    );

    expect(screen.queryByText(/See detailed view/i)).not.toBeInTheDocument();
  });
});
