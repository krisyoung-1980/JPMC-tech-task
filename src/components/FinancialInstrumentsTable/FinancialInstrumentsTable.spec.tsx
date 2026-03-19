import { vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";
import { FinancialInstrumentsTable } from "./FinancialInstrumentsTable";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("FinancialInstrumentsTable", () => {
  it("shows a loading state initially", () => {
    render(<FinancialInstrumentsTable />);
    expect(
      screen.getByRole("status", { name: "Loading instruments" }),
    ).toBeInTheDocument();
  });

  it("renders the table with data returned from the mock API", async () => {
    render(<FinancialInstrumentsTable />);
    await act(() => vi.runAllTimersAsync());
    expect(
      screen.getByRole("table", { name: "Financial instruments" }),
    ).toBeInTheDocument();
    expect(screen.getByText("ALPHA")).toBeInTheDocument();
    expect(screen.getByText("OMIKRON")).toBeInTheDocument();
  });

  it("does not show an error when the API succeeds", async () => {
    render(<FinancialInstrumentsTable />);
    await act(() => vi.runAllTimersAsync());
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByText(/failed to load/i)).not.toBeInTheDocument();
  });

  it("shows an error panel when the API request fails", async () => {
    const handler = http.get("/api/instruments", () => HttpResponse.error());
    server.use(handler);
    render(<FinancialInstrumentsTable />);
    await act(() => vi.runAllTimersAsync());
    expect(screen.getByText("Failed to load instruments")).toBeInTheDocument();
  });
});
