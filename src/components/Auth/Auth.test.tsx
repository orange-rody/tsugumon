import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import CreatePost from "../CreatePost/CreatePost";
import Auth from "./Auth";
import { auth } from "../../firebase";
import styled from "styled-components";

// itの後に毎回行う処理はafterEachで設定することができる
// cleanupを実行するとrender()でレンダリングされた内容をアンマウントすることができる
afterEach(() => cleanup());

