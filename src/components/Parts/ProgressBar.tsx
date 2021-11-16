import React, { useEffect } from "react";
import useStorage from "../../hooks/useStorage";
import styled from "styled-components";

const Bar = styled.div`
  height: 5px;
  background-color: "#50a0d0";
  margin-top: 20px;
`;

type Props = {
  dataUrl: string;
  setDataUrl: any;
  caption: string;
  setCaption: any;
  filename: string;
  setFilename: any;
  setPreview: any;
};
const ProgressBar = ({
  dataUrl,
  setDataUrl,
  caption,
  setCaption,
  filename,
  setFilename,
  setPreview,
}: Props) => {
  const { url, progress } = useStorage(filename, dataUrl, caption);
  useEffect(() => {
    if (url) {
      setDataUrl("");
      setCaption("");
      setFilename("");
      setPreview(false);
    }
  }, [url]);
  return <Bar style={{ width: progress + "%" }} />;
};

export default ProgressBar;
