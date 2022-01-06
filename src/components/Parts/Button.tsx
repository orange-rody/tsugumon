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

type Props = {
  dataTestId: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  children: React.ReactNode;
  color?: "primary" | "secondary" | undefined;
  style?: React.CSSProperties;
  variant: "outlined" | "contained";
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      height: "40px",
      borderRadius: "50px",
      fontSize: "18px",
      fontWeight: "bold",
    },
  })
);

const Btn = (props: Props) => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <Button
        data-testid={props.dataTestId}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => props.onClick(e)}
        disabled={props.disabled}
        variant={props.variant}
        component="span"
        size="medium"
        color={props.color}
        style={props.style}
        className={classes.button}
      >
        {props.children}
      </Button>
    </ThemeProvider>
  );
};

export default Btn;
