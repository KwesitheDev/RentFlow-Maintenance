import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the product homepage", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { name: /good homes/i }),
  ).toBeInTheDocument();
});
