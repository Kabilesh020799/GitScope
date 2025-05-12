import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import Heatmap from "./heatmap";

const MOCK_DATA = [
  {
    commit: {
      author: {
        date: "2024-04-15T10:00:00Z",
        name: "Alice",
      },
      message: "Initial commit",
    },
  },
  {
    commit: {
      author: {
        date: "2024-04-15T12:30:00Z",
        name: "Alice",
      },
      message: "Update README",
    },
  },
];

describe("Heatmap Component", () => {
  test("renders heatmap and opens modal on cell click", async () => {
    render(<Heatmap data={MOCK_DATA} />);

    await waitFor(() => {
      const svg = document.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    const cells = document.querySelectorAll("rect");
    expect(cells.length).toBeGreaterThan(0);

    fireEvent.click(cells[0]);

    await waitFor(() => {
      expect(screen.getByText(/Commits on/i)).toBeInTheDocument();
    });
  });
});
