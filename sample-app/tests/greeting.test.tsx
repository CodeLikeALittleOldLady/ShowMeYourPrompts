import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import Greeting from "@/components/Greeting";

afterEach(cleanup);

it("greets by name", () => {
  render(<Greeting name="Alison" />);
  expect(screen.getByRole("heading", { name: "Hello, Alison" })).toBeTruthy();
});
