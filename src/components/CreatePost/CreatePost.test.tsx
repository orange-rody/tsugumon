import React from "react";
import { act } from "react-dom/test-utils";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import CreatePost from "./CreatePost";

afterEach(() => cleanup());

describe("CreatePostが正しくレンダリングされるか確認する", () => {
  it("全ての要素が正しくレンダリングされるか確認する", () => {
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

describe("テキストエリアのonChangeイベントを確認する", () => {
  it("テキストエリアのvalueが正しくアップデートされるか確認する", () => {
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

describe("input type = file がonChangeとなったとき、stateの値が正しくアップデートされるか確認する", () => {
  it("画像ファイルが未選択のときはデフォルトの画像がプレビューされるか確認する", () => {
    render(
      <Provider store={store}>
        <CreatePost />
      </Provider>
    );
    const noImage = screen.getByTestId("noImage") as HTMLImageElement;
    expect(noImage.src).toBe("http://localhost/noPhoto.png");
  });

  it("画像ファイルを選択したとき、handleImage()が呼び出されるか確認する", () => {
    // NOTE >> ダミーのFileオブジェクトを作成
    // NOTE >> new Fileの第一引数はバッファデータに関するもの。バッファデータを
    //         配列に格納して指定する。複数のデータを格納すると、内部で昇順に結合される。
    //         ArrayBuffer,Blob,Stringなどのデータ形式がしていできるが、その他の型を
    //         入力すると、自動的に文字列型に変換される。
    const imageFile = new File(["new order"], "blueMonday.png", {
      type: "image/png",
    });
    act(() => {
      render(
        <Provider store={store}>
          <CreatePost />
        </Provider>
      );
    });
    // FIX >> getByTestId("inputFile")をHTMLElementとして型注釈すると、
    //        expect(inputFile.files![0]).toStrictEqual(imageFile);のところで、
    //        「プロパティ 'files' は型 'HTMLElement' に存在しません。」といった
    //        エラーが生じてしまう。
    // SOLVED >> https://ja.stackoverflow.com/questions/65399/ を参考に
    //           「screen.getByTestId("inputFile") as HTMLInputElement」と
    //           記載してみたところ、エラーを解決することができた。
    const inputFile = screen.getByTestId("inputFile") as HTMLInputElement;

    // NOTE >> upload(element,file)
    //         uploadの第一引数はアップロードイベントを発火させる要素。
    //         第二引数はアップロードの対象となるfile。
    // FIX >> userEvent.uploadを記述すると、以下のエラーが表示される。
    //        "TypeError: _userEvent.default.upload is not a functionJest"
    // SOLVED >> package.jsonの中身を確認したところ、
    //           "@testing-library/user-event": "^7.2.1"となっていた。
    //           次に"https://www.npmjs.com/package/@testing-library/user-event"を
    //           確認してみたところ、最新の@testing-library/user-eventは"^13.1.9"と
    //           なっていた。そこで、FIXのエラーは、version 7.2.1の
    //           @testing-library/user-eventにuploadのプロパティが存在しないために
    //           発生しているものと推測し、versionを"^13.1.9"に指定してnpm installを
    //           行なったところ、エラーが解消された。
    //           ※なぜnpm installを行なった時に古いversionである"^7.2.1"がインストール
    //             されるのかは不明。
    userEvent.upload(inputFile, imageFile) as void;
    expect(inputFile.files![0]).toStrictEqual(imageFile);
  });
});
