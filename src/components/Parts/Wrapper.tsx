import React from "react";
import styled from "styled-components";
// NOTE >> styled-componentをfunctionコンポーネントの中で使用すると、
//         textareaの入力時に不具合が起きてしまう。そのため、Wrapperを
//         別のコンポーネントで定義し、styled-media-queryを使用して、
//        コンポーネントの外部でメディアクエリの判定を行うようにする。

import mediaQuery from "styled-media-query";

// NOTE >> mediumよりサイズが小さかったらmediaMobileのプロパティが設定されるようにする。
const mediaMobile = mediaQuery.lessThan("medium");

const WrapperComponent = styled.div`
  position: relative;
  width: 30vw;
  ${mediaMobile`
width: 100vw;`}
  height: calc(100% - 40px);
  ${mediaMobile`
height: 100vh`};
  margin: 0 auto;
  ${mediaMobile`
margin: 0`};
  top: 20px;
  ${mediaMobile`
top: 0`};
`;

type Props = {
  children: JSX.Element;
  style?: React.CSSProperties | undefined;
};

const Wrapper = (props: Props) => {
  return (
    <WrapperComponent data-testid="wrapper">{props.children}</WrapperComponent>
  );
};

export default Wrapper;
