import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Auth from "../Auth";

// itの後に毎回行う処理はafterEachで設定することができる
// cleanupを実行するとrender()でレンダリングされた内容をアンマウントすることができる
afterEach(() => cleanup());

describe("Rendering", () => {
  it("Should render the elements correctly", () => {
    render(<Auth />);
    expect(screen.getByTestId("header")).toBeTruthy();
    expect(screen.getByTestId("avatar")).toBeTruthy();
    expect(screen.getByTestId("main")).toBeTruthy();
    expect(screen.getByTestId("email")).toBeTruthy();
    expect(screen.getByTestId("password")).toBeTruthy();
    expect(screen.getByTestId("toggle-button")).toBeTruthy();
    expect(screen.getAllByRole("button")[0]).toBeTruthy();
    expect(screen.getByTestId("login")).toBeTruthy();
    expect(screen.getByTestId("guide-for-sign-up")).toBeTruthy();
    expect(screen.getByTestId("guide-for-password")).toBeTruthy();
    expect(screen.getByTestId("test-user-button")).toBeTruthy();
    expect(screen.getByTestId("footer")).toBeTruthy();
  });
});


