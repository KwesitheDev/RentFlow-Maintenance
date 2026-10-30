import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Demo from "./Demo";
const mockGet = jest.fn();
const mockPost = jest.fn();
jest.mock("axios", () => ({
  create: () => ({
    get: (...args) => mockGet(...args),
    post: (...args) => mockPost(...args),
  }),
}));
beforeEach(() => {
  sessionStorage.clear();
  jest.clearAllMocks();
});
test("offers every role and launches a server-managed workspace without credentials", async () => {
  mockPost.mockResolvedValue({ data: { token: "opaque-session" } });
  mockGet.mockResolvedValue({
    data: {
      role: "tenant",
      actor: { name: "Abena Asare" },
      organization: { name: "Fictional organization" },
      expiresAt: new Date().toISOString(),
      properties: [],
      units: [],
      people: [],
      requests: [],
      notifications: [],
      report: null,
    },
  });
  render(
    <MemoryRouter>
      <Demo />
    </MemoryRouter>,
  );
  for (const role of [
    "Owner / Administrator",
    "Property Manager",
    "Tenant",
    "Contractor / Technician",
  ])
    expect(
      screen.getByRole("button", { name: `Launch ${role} demo` }),
    ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Launch Tenant demo" }));
  await waitFor(() =>
    expect(screen.getByText("Fictional organization")).toBeInTheDocument(),
  );
  expect(mockPost).toHaveBeenCalledWith("/sessions", { role: "tenant" });
  expect(sessionStorage.getItem("rentflow-demo")).toBe("opaque-session");
  expect(
    screen.getByRole("heading", { name: "My requests" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByText("Operational report · Your permitted properties"),
  ).not.toBeInTheDocument();
});
test("shows a recoverable error when the demo server cannot launch", async () => {
  mockPost.mockRejectedValue({
    response: { data: { message: "Demo capacity reached." } },
  });
  render(
    <MemoryRouter>
      <Demo />
    </MemoryRouter>,
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Launch Property Manager demo" }),
  );
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Demo capacity reached.",
  );
});
