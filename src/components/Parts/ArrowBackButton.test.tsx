import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ArrowBackButton from "./ArrowBackButton";

afterEach(() => cleanup());
const closeAdd = jest.fn();

describe("ArrowBackButtonが正しくレンダリングされるか確認する", () => {
  it("全ての要素が正しくレンダリングされるか確認する", () => {
    render(
      <ArrowBackButton
        dataTestId="arrowBackButton"
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          closeAdd();
        }}
      />
    );
    expect(screen.getByRole("button")).toBeTruthy();
  });
});

describe("ArrowBackButtonが正しく機能するか確認する", () => {
  it("ArrowBackButtonをクリックしたときcloseAddが呼び出されるか確認する", () => {
    render(
      <ArrowBackButton
        dataTestId="arrowBackButton"
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          closeAdd();
        }}
      />
    );
    const arrowBackButton = screen.getByTestId("arrowBackButton");
    userEvent.click(arrowBackButton);
    expect(closeAdd).toHaveBeenCalledTimes(1);
  });
});
