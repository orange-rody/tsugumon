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
    screen.debug();
  });
});
