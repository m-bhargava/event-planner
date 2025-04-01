import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import App from "./App";
import "@testing-library/jest-dom";

// Mock Axios
jest.mock("axios");

describe("Event Planner App", () => {
  test("renders the app with input fields and button", () => {
    render(<App />);

    expect(screen.getByText("🎉 Event Planner")).toBeInTheDocument();
    expect(screen.getByLabelText("Enter city name")).toBeInTheDocument();
    expect(screen.getByLabelText("Enter keyword")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search events/i })).toBeInTheDocument();
  });

  test("updates input fields correctly", () => {
    render(<App />);
    
    const cityInput = screen.getByLabelText("Enter city name");
    const keywordInput = screen.getByLabelText("Enter keyword");

    fireEvent.change(cityInput, { target: { value: "New York" } });
    fireEvent.change(keywordInput, { target: { value: "Concert" } });

    expect(cityInput.value).toBe("New York");
    expect(keywordInput.value).toBe("Concert");
  });

  test("fetches and displays events on search", async () => {
    axios.get.mockResolvedValue({
      data: {
        _embedded: {
          events: [
            {
              id: "1",
              name: "Rock Concert",
              dates: { start: { localDate: "2025-03-10" } },
              images: [{ url: "https://example.com/concert.jpg" }],
              url: "https://example.com/event/1",
            },
          ],
        },
      },
    });

    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /search events/i }));

    await waitFor(() => {
      expect(screen.getByText("Rock Concert")).toBeInTheDocument();
      expect(screen.getByText("2025-03-10")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /view details/i })).toHaveAttribute(
        "href",
        "https://example.com/event/1"
      );
    });
  });

  test("handles no events found scenario", async () => {
    axios.get.mockResolvedValue({
      data: {},
    });

    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /search events/i }));

    await waitFor(() => {
      expect(screen.getByText("No events found.")).toBeInTheDocument();
    });
  });

  test("handles API error scenario", async () => {
    axios.get.mockRejectedValue(new Error("Network Error"));

    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /search events/i }));

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch events. Please try again.")).toBeInTheDocument();
    });
  });
});
