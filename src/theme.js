import { createTheme } from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#673ab7",
    },
    secondary: {
      main: "#ffea00",
    },
    warning: {
      main: "#fb8c00",
    },
  },
  tag: {
    period: {
      backgroundColor: "#673ab7",
      textColor: "white",
    },
    social: {
      backgroundColor: "#ffea00",
      textColor: "white",
    },
    prominence: {
      backgroundColor: "#73a3f0",
      textColor: "white",
    },
  },
  valid: { color: "#77dd77" },
});

export default theme;
