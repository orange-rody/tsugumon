import React from "react";
import {
  Button,
  createStyles,
  createMuiTheme,
  makeStyles,
  Theme,
  ThemeProvider,
} from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#4fc0ad",
      main: "#008f7e",
      dark: "#006152",
      contrastText: "#fff",
    },
    secondary: {
      light: "#50a0d0",
      main: "#00729f",
      dark: "#004770",
      contrastText: "#fff",
    },
  },
});

const useStyles = makeStyles((thme: Theme) =>
  createStyles({
    narrow: {
      width: "120px",
      height: "40px",
      borderRadius: "50px",
      fontSize: "18px",
      fontWeight: "bold",
    },
    wide: {
      width: "200px",
      height: "40px",
      borderRadius: "50px",
      fontSize: "18px",
      fontWeight: "bold",
    },
  })
);

type Props = {
  dataTestId: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  child: string;
  wide:boolean;
};
const DefaultButton = (props: Props) => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <Button
        data-testid={props.dataTestId}
        onClick={(e: React.MouseEvent<HTMLElement>) => props.onClick(e)}
        variant="outlined"
        color="default"
        size="large"
        className={props.wide ? classes.wide : classes.narrow}
      >
        {props.child}
      </Button>
    </ThemeProvider>
  );
};

export default DefaultButton;
