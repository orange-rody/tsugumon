import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import CreatePost from "./CreatePost";
import { handleImage } from "./CreatePost";

afterEach(() => cleanup());

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

describe("テキストエリアのonChangeイベント", () => {
  it("テキストエリアのvalueが正しくアップデートされるか", () => {
    render(
      <Provider store={store}>
        <CreatePost />
      </Provider>
    );
    // NOTE >> screen.getByTestId()は、valueプロパティを含まないタイプの
    //         HTMLElementを返すため、screen.getByTestId("textarea")を
    //         valueの値を持つHTMLInputElementとして型キャストしてあげる
    //         必要がある。
    const textarea = screen.getByTestId("textarea") as HTMLInputElement;
    userEvent.type(textarea, "test");
    expect(textarea.value).toBe("test");
  });
});

describe("input type = file がonChangeとなったとき、正しくアップデートされるか", () => {
  it("画像ファイルが未選択のときはデフォルトの画像がプレビューされるか確認する", () => {
    render(
      <Provider store={store}>
        <CreatePost />
      </Provider>
    );
    const noImage = screen.getByTestId("noImage") as HTMLImageElement;
    expect(noImage.src).toBe("http://localhost/noPhoto.png");
  });

  it("画像ファイルがonChangeとなったとき、stateの値が正しくアップデートされるか", () => {
    // NOTE >> ダミーのFileオブジェクトを作成
    // NOTE >> new Fileの第一引数はバッファデータに関するもの。バッファデータを
    //         配列に格納して指定する。複数のデータを格納すると、内部で昇順に結合される。
    //         ArrayBuffer,Blob,Stringなどのデータ形式がしていできるが、その他の型を
    //         入力すると、自動的に文字列型に変換される。
    const file = new File(["new order"], "blueMonday.png", {
      type: "image/png",
    });
    render(
      <Provider store={store}>
        <CreatePost />
      </Provider>
    );
    const inputFile = screen.getByTestId("inputFile");
    // NOTE >> upload(element,file)
    //         uploadの第一引数はアップロードイベントを発火させる要素。
    //         第二引数はアップロードの対象となるfile。
    userEvent.upload(inputFile, file) as any;
  });
});
