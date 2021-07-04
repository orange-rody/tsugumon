import React from "react";
import {
  Button,
  createStyles,
  createMuiTheme,
  makeStyles,
  Theme,
  ThemeProvider,
} from "@material-ui/core";
import { CropOriginal } from "@material-ui/icons";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#4fc0ad",
      main: "#008f7e",
      dark: "#006152",
      contrastText: "#fff",
    },
  },
});

const useStyles = makeStyles((thme: Theme) =>
  createStyles({
    button: {
      width: "120px",
      height: "40px",
      borderRadius: "50px",
      fontSize: "18px",
      fontWeight: "bold",
    },
  })
);

// NOTE >> InputFileButtonの中にある<input />のonChangeイベントを、呼び出し元の
//         親ファイルのプロパティ（onChange）に伝えるため、type Propsの形で
//         プロパティ(onChange)の型宣言を行なっている。
type Props = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

// NOTE >> Input type="file"専用のボタンを作成
const InputFileButton = (props: Props) => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <input
        style={{ display: "none" }}
        type="file"
        id="inputFile"
        onClick={(e:any) => (e.target.value = null)}
        onChange={(e:React.ChangeEvent<HTMLInputElement>) => props.onChange(e)}
        data-testid="inputFile"
      />
      <label htmlFor="inputFile">
        <Button
          variant="contained"
          component="span"
          size="large"
          startIcon={<CropOriginal />}
          color="primary"
          className={classes.button}
          data-testid="buttonForSelect"
        >
          選ぶ
        </Button>
      </label>
    </ThemeProvider>
  );
};

export default InputFileButton;
