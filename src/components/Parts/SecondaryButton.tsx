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
    button: {
      width: "120px",
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
  disabled: boolean;
  child: string;
};

const SecondaryButton = (props: Props) => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <Button
        data-testid={props.dataTestId}
        onClick={(e: React.MouseEvent<HTMLElement>) => props.onClick(e)}
        disabled={props.disabled}
        variant="contained"
        component="span"
        size="large"
        color="secondary"
        className={classes.button}
      >
        {props.child}
      </Button>
    </ThemeProvider>
  );
};

export default SecondaryButton;
