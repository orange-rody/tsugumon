import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import Auth from "./Auth";

// itの後に毎回行う処理はafterEachで設定することができる
// cleanupを実行するとrender()でレンダリングされた内容をアンマウントすることができる
afterEach(() => cleanup());

describe("Rendering", () => {
  it("Should render the elements correctly", () => {
    render(<Auth />);
    screen.debug();
  });
});
