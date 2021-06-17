import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import CreatePost from "./CreatePost";

describe("CreatePostが正しくレンダリングされるか", () => {
  it("全ての要素が正しくレンダリングされるか", () => {
    render(
      // NOTE >> Does CreatePost display correctly? > Do all the elements display correctly?
      //         It could not find react-redux context value;
      //         please ensure the component is wrapped in a <Provider>.Rendering >
      //         Should render the elements correctly
      //         上記のエラーメッセージから、コンポーネントを<Provide>でラップしておらず、
      //         react-reduxに登録されている値が見つからないためにエラーが発生していると想定。
      //         ProviderとStoreをインポートし、コンポーネントを＜Provider>でラップしたところ、
      //         問題が解決した。

      <Provider store={store}>
        <CreatePost />
      </Provider>
    );
    // screen.debug(screen.getByRole("heading"));
    expect(screen.getByTestId("wrapper")).toBeTruthy();
    expect(screen.getByTestId("paper")).toBeTruthy();
    expect(screen.getByTestId("header")).toBeTruthy();
    expect(screen.getByTestId("title")).toBeTruthy();
    expect(screen.getByTestId("imageWrap")).toBeTruthy();
    expect(screen.getByTestId("notes")).toBeTruthy();
    expect(screen.getByTestId("inputFile")).toBeTruthy();
    expect(screen.getByTestId("buttonForSelect")).toBeTruthy();
    expect(screen.getByTestId("buttonForClear")).toBeTruthy();
    expect(screen.getByTestId("textarea")).toBeTruthy();
    expect(screen.getByTestId("togglePreview")).toBeTruthy();
    // expect(screen.getByTestId("paperForPreview")).toBeTruthy();
    // expect(screen.getByTestId("previewHeader")).toBeTruthy();
    // expect(screen.getByTestId("previewTitle")).toBeTruthy();
    // expect(screen.getByTestId("previewUserName")).toBeTruthy();
    // expect(screen.getByTestId("previewImageUrl")).toBeTruthy();
    // expect(screen.getByTestId("commentArea")).toBeTruthy();
    // expect(screen.getByTestId("buttonForUpload")).toBeTruthy();
    // expect(screen.getByTestId("togglePreview")).toBeTruthy();
  });
});
