import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Landing from "./Landing";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
test("public navigation expands and provides role workflow links", () => {
  render(
    <MemoryRouter>
      <Landing />
    </MemoryRouter>,
  );
  const button = screen.getByRole("button", { name: "Open navigation" });
  fireEvent.click(button);
  expect(
    screen.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeInTheDocument();
  expect(button).toHaveAttribute("aria-expanded", "true");
  fireEvent.click(screen.getByRole("button", { name: "Close navigation" }));
  expect(
    screen.queryByRole("navigation", { name: "Mobile navigation" }),
  ).not.toBeInTheDocument();
});
test("closed signup guides visitors to an available demo instead of a failing form", () => {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>,
  );
  expect(
    screen.getByRole("link", { name: "Explore the demo" }),
  ).toHaveAttribute("href", "/demo");
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
});
test("account help explains recovery availability without requesting secrets", () => {
  render(
    <MemoryRouter>
      <ForgotPassword />
    </MemoryRouter>,
  );
  expect(
    screen.getByText(/Self-service email recovery is not currently available/),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Back to sign in" })).toHaveAttribute(
    "href",
    "/login",
  );
});
