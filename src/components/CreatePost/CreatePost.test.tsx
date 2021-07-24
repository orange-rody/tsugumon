import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import CreatePost from "./CreatePost";
import InputFileButton from "../Parts/InputFileButton";
import DefaultButton from "../Parts/DefaultButton";
import SecondaryButton from "../Parts/SecondaryButton";
import Header from "../Parts/Header";
import ArrowBackButton from "../Parts/ArrowBackButton";

afterEach(() => cleanup());
const closeAdd = jest.fn();
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
        <CreatePost open={true} closeAdd={closeAdd} />
      </Provider>
    );
    // NOTE >> テストコードでは、呼び出し元のコンポーネント内のTestIdで要素を検証する。
    expect(screen.getByTestId("main")).toBeTruthy();
    expect(screen.getByTestId("header")).toBeTruthy();
    expect(screen.getByTestId("closeButton")).toBeTruthy();
    expect(screen.getByTestId("imageWrap")).toBeTruthy();
    expect(screen.getByTestId("noImage")).toBeTruthy();
    expect(screen.getByTestId("notes")).toBeTruthy();
    expect(screen.getByTestId("arrowDownward")).toBeTruthy();
    expect(screen.getByTestId("buttonArea")).toBeTruthy();
    expect(screen.getByTestId("inputFile")).toBeTruthy();
    expect(screen.getByTestId("buttonForClear")).toBeTruthy();
    expect(screen.getByTestId("textarea")).toBeTruthy();
    expect(screen.getByTestId("previewOn")).toBeTruthy();
  });
});

describe("テキストエリアのonChangeイベントを確認する", () => {
  it("テキストエリアのvalueが正しくアップデートされるか確認する", () => {
    render(
      <Provider store={store}>
        <CreatePost open={true} closeAdd={closeAdd} />
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

describe("input type = file の値に合わせて適正にプレビューされるか確認する", () => {
  it("画像ファイルが未選択のときはデフォルトの画像がプレビューされるか確認する", () => {
    render(
      <Provider store={store}>
        <CreatePost open={true} closeAdd={closeAdd} />
      </Provider>
    );
    const noImage = screen.getByTestId("noImage") as HTMLImageElement;
    expect(noImage.src).toBe("http://localhost/noPhoto.png");
  });

  it("画像ファイルを選択したとき、handleImage()が発火されるか確認する", () => {
    const handleImage = jest.fn();
    const imageFile = new File(["new order"], "blueMonday.png", {
      type: "image/png",
    });
    // NOTE >> ダミーのFileオブジェクトを作成
    // NOTE >> new Fileの第一引数はバッファデータに関するもの。バッファデータを
    //         配列に格納して指定する。複数のデータを格納すると、内部で昇順に結合される。
    //         ArrayBuffer,Blob,Stringなどのデータ形式がしていできるが、その他の型を
    //         入力すると、自動的に文字列型に変換される。
    render(<InputFileButton onChange={handleImage} />);
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
    expect(handleImage).toHaveBeenCalledTimes(1);
  });
  // TODO >> プレビューするためのコンポーネントである<Image />が正確に描写されるか確認する。
});

describe("「消す」ボタンをクリックしたとき、適正に動作するか確認する", () => {
  it("「消す」ボタンをクリックしたとき、clearDraft()が発火されるか確認する", () => {
    const clearDraft = jest.fn();
    render(
      <DefaultButton
        child="消す"
        onClick={clearDraft}
        dataTestId="buttonForClear"
      />
    );
    const buttonForClear = screen.getByTestId("buttonForClear");
    userEvent.click(buttonForClear);
    expect(clearDraft).toHaveBeenCalledTimes(1);
  });
});

describe("「次へ進む」ボタンが正常に起動するか確認する", () => {
  it("「次へ進む」ボタンをクリックした際にtogglePreviewが呼び出されるか確認する", () => {
    const togglePreview = jest.fn();
    render(
      <SecondaryButton
        dataTestId="toggleButton"
        onClick={togglePreview}
        disabled={false}
        child="次へ進む"
      />
    );
    const toggleButton = screen.getByTestId("toggleButton");
    userEvent.click(toggleButton);
    expect(togglePreview).toHaveBeenCalledTimes(1);
  });

  it("previewがtrueのとき、プレビュー画面の要素がレンダリングされるか確認する", () => {
    render(
      <Provider store={store}>
        <CreatePost open={true} closeAdd={closeAdd} />
      </Provider>
    );
    const previewOn = screen.getByTestId("previewOn") as HTMLButtonElement;
    previewOn.style.pointerEvents = "auto";
    userEvent.click(previewOn);
    expect(screen.getByTestId("paperForPreview")).toBeTruthy();
    expect(screen.getByTestId("previewUserName")).toBeTruthy();
    expect(screen.getByTestId("previewImageUrl")).toBeTruthy();
    expect(screen.getByTestId("commentArea")).toBeTruthy();
    expect(screen.getByTestId("buttonForUpload")).toBeTruthy();
    expect(screen.getByTestId("previewOff")).toBeTruthy();
  });

  it("「戻る」ボタンをクリックしたとき、togglePreviewが呼び出されるか確認する", () => {
    const togglePreview = jest.fn();
    render(
      <DefaultButton
        dataTestId="previewOff"
        onClick={togglePreview}
        child="戻る"
      />
    );
    const previewOff = screen.getByTestId("previewOff");
    userEvent.click(previewOff);
    expect(togglePreview).toHaveBeenCalledTimes(1);
  });
  it("「投稿する」ボタンをクリックしたときにuploadが呼び出されるか確認する", () => {
    const upload = jest.fn();
    render(
      <SecondaryButton
        dataTestId="buttonForUpload"
        onClick={upload}
        disabled={false}
        child="投稿する"
      />
    );
    const buttonForUpload = screen.getByTestId("buttonForUpload");
    userEvent.click(buttonForUpload);
    expect(upload).toHaveBeenCalledTimes(1);
  });
});

describe("Closeボタンが正常に稼働するか確認する。", () => {
  it("Headerでcloseボタンが適正に描写されるか確認する", () => {
    render(
      <Provider store={store}>
        <CreatePost open={true} closeAdd={closeAdd} />
      </Provider>
    );
    expect(screen.getByTestId("closeButton")).toBeTruthy();
  });
  it("closeボタンが押されたら、closeAddが呼び出されるか確認する", () => {
    render(
      <Provider store={store}>
        <CreatePost open={true} closeAdd={closeAdd} />
      </Provider>
    );
    const closeButton = screen.getByTestId("closeButton");
    userEvent.click(closeButton);
    expect(closeAdd).toHaveBeenCalledTimes(1);
  });
});

describe("ArrowBackボタンが正常に稼働するか確認する。", () => {
  const togglePreview = jest.fn();
  it("HeaderでArrowBackボタンが適正に描写されるか確認する", () => {
    render(
      <Header child="写真を登録する">
        <ArrowBackButton onClick={togglePreview} dataTestId="arrowBackButton" />
      </Header>
    );
    expect(screen.getByRole("button")).toBeTruthy();
  });
});
