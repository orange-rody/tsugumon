import React from "react";
import { screen, render, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "../app/store";
import MainView from "./MainView";
import CreatePost from "./CreatePost/CreatePost";

afterEach(() => cleanup());

describe("MainViewが正しくレンダリングされるか確認する", () => {
  it("全ての要素が正しくレンダリングされるか確認する", () => {
    render(
      <Provider store={store}>
        <MainView />
      </Provider>
    );
    expect(screen.getByTestId("wrapper")).toBeTruthy();
    expect(screen.getByTestId("tabs")).toBeTruthy();
    expect(screen.getByTestId("home")).toBeTruthy();
    expect(screen.getByTestId("search")).toBeTruthy();
    expect(screen.getByTestId("add")).toBeTruthy();
    expect(screen.getByTestId("notification")).toBeTruthy();
    expect(screen.getByTestId("profile")).toBeTruthy();
    expect(screen.getByTestId("createPost")).toBeTruthy();
  });
});

describe("タブバーが正常に動作するか確認する", () => {
  it("一つのタブを選択したとき、一方のタブの選択が解除されることを検証する", () => {
    // const setSelectedTab = (e: React.MouseEvent<HTMLElement>) => {
    //   jest.fn();
    // };
    render(
      <Provider store={store}>
        <MainView />
      </Provider>
    );
    const home = screen.getByRole("radio", { name: "home" });
    const search = screen.getByRole("radio", { name: "search" });
    const add = screen.getByTestId("add");
    const notification = screen.getByRole("radio", {
      name: "notification",
    });
    const profile = screen.getByRole("radio", { name: "profile" });
    // NOTE >> homeをクリックしたとき、homeが"checked"に、それ以外が"not.checked"になるか検証する。
    userEvent.click(home);
    userEvent.click(add);
    expect(home).toBeChecked();
    expect(search).not.toBeChecked();
    expect(notification).not.toBeChecked();
    expect(profile).not.toBeChecked();
    // NOTE >> searchをクリックしたとき、searchが"checked"に、それ以外が"not.checked"になるか検証する。
    userEvent.click(search);
    userEvent.click(add);
    expect(search).toBeChecked();
    expect(home).not.toBeChecked();
    expect(notification).not.toBeChecked();
    expect(profile).not.toBeChecked();
    // expect(setSelectedTab).toHaveBeenCalledTimes(1);
    // NOTE >> notificationをクリックしたとき、notificationが"checked"に、それ以外が"not.checked"になるか検証する。
    userEvent.click(notification);
    userEvent.click(add);
    expect(notification).toBeChecked();
    expect(home).not.toBeChecked();
    expect(search).not.toBeChecked();
    expect(profile).not.toBeChecked();
    // NOTE >> profileをクリックしたとき、peofileが"checked"に、それ以外が"not.checked"になるか検証する。
    userEvent.click(profile);
    userEvent.click(add);
    expect(profile).toBeChecked();
    expect(home).not.toBeChecked();
    expect(search).not.toBeChecked();
    expect(notification).not.toBeChecked();
  });
});
