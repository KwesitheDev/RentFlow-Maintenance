import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import RequestsView from "./RequestsView";
import Properties from "./Properties";
import Dashboard from "./Dashboard";
const get = jest.fn();
const put = jest.fn();
const record = {
  _id: "r1",
  tenantName: "Abena",
  property: "Palm Court",
  issueDescription: "Kitchen sink leak",
  priority: "high",
  status: "pending",
  assignedTo: "",
  createdAt: "2026-10-01T12:00:00Z",
  notes: [],
};
const context = {
  user: { id: "admin", name: "Ama Owusu", role: "admin" },
  axiosWithAuth: { get, put },
  logout: jest.fn(),
};
function mount(element, path = "/app/requests") {
  return render(
    <AuthContext.Provider value={context}>
      <MemoryRouter initialEntries={[path]}>{element}</MemoryRouter>
    </AuthContext.Provider>,
  );
}
beforeEach(() => {
  jest.clearAllMocks();
  get.mockResolvedValue({ data: [record] });
});
test("status changes send only editable fields and remain visible after saving", async () => {
  put.mockResolvedValue({ data: { ...record, status: "inProgress" } });
  mount(<RequestsView />);
  const select = await screen.findByRole("combobox", {
    name: "Status for Kitchen sink leak",
  });
  fireEvent.change(select, { target: { value: "inProgress" } });
  await waitFor(() =>
    expect(put).toHaveBeenCalledWith("/requests/r1", { status: "inProgress" }),
  );
  expect(await screen.findByRole("status")).toHaveTextContent(
    "Request updated.",
  );
});
test("request search has a clear empty state and filter recovery", async () => {
  mount(<RequestsView />);
  await screen.findByRole("button", { name: "Kitchen sink leak" });
  fireEvent.change(screen.getByRole("textbox", { name: "Search requests" }), {
    target: { value: "no such repair" },
  });
  expect(
    screen.getByRole("heading", { name: "No matching requests" }),
  ).toBeInTheDocument();
  fireEvent.click(
    within(screen.getByLabelText("Maintenance queue")).getAllByRole("button", {
      name: "Clear filters",
    })[0],
  );
  expect(
    screen.getByRole("button", { name: "Kitchen sink leak" }),
  ).toBeInTheDocument();
});
test("new request dialog is named and preserves input when cancelled and reopened", async () => {
  mount(<RequestsView />);
  await screen.findByRole("button", { name: "Kitchen sink leak" });
  fireEvent.click(screen.getByRole("button", { name: "New request" }));
  const dialog = screen.getByRole("dialog", {
    name: "New maintenance request",
  });
  fireEvent.change(within(dialog).getByLabelText(/Tenant name/), {
    target: { value: "Abena" },
  });
  fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "New request" }));
  expect(screen.getByLabelText(/Tenant name/)).toHaveValue("Abena");
});
test("property failures show retry instead of fictional customer records", async () => {
  get.mockRejectedValue(new Error("offline"));
  mount(<Properties />, "/app/properties");
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "couldn’t load property activity",
  );
  expect(screen.queryByText("Sunset Apartments")).not.toBeInTheDocument();
  get.mockResolvedValue({ data: [record] });
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(
    await screen.findByRole("heading", { name: "Palm Court" }),
  ).toBeInTheDocument();
});
test("mobile workspace menu opens and closes with Escape", () => {
  mount(<Dashboard />);
  const toggle = screen.getByRole("button", { name: "Open workspace menu" });
  fireEvent.click(toggle);
  expect(
    screen.getByRole("button", { name: "Close workspace menu" }),
  ).toHaveAttribute("aria-expanded", "true");
  expect(document.getElementById("workspace-mobile-menu")).toBeInTheDocument();
  fireEvent.keyDown(document, { key: "Escape" });
  expect(
    document.getElementById("workspace-mobile-menu"),
  ).not.toBeInTheDocument();
});
