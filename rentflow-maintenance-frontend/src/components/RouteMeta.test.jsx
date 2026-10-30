import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Link, Routes, Route } from "react-router-dom";
import RouteMeta from "./RouteMeta";
import { SITE_ORIGIN } from "../content/site";
test("keeps canonical metadata unique and removes public indexing on workspace navigation", () => {
  window.scrollTo = jest.fn();
  render(
    <MemoryRouter initialEntries={["/features"]}>
      <RouteMeta />
      <main>
        <Routes>
          <Route
            path="/features"
            element={
              <>
                <h1>Features</h1>
                <Link to="/app/requests">Open workspace</Link>
              </>
            }
          />
          <Route path="/app/requests" element={<h1>Maintenance requests</h1>} />
        </Routes>
      </main>
    </MemoryRouter>,
  );
  expect(document.title).toMatch(/Maintenance Request Tracking Features/);
  expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
  expect(document.querySelector('link[rel="canonical"]').href).toBe(
    `${SITE_ORIGIN}/features`,
  );
  fireEvent.click(screen.getByRole("link", { name: "Open workspace" }));
  expect(document.querySelector('meta[name="robots"]').content).toBe(
    "noindex, nofollow",
  );
  expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  expect(document.getElementById("site-structured-data")).toBeNull();
  expect(
    screen.getByRole("heading", { name: "Maintenance requests" }),
  ).toHaveFocus();
});
