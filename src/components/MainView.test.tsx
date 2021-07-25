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
