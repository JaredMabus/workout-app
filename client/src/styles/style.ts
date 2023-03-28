import { createTheme } from "@mui/material/styles";

const otherThemes = {
  typography: {
    // h1: {
    //   fontWeight: 500,
    // },
    // h2: {
    //   fontWeight: 500,
    // },
    // h3: {
    //   fontWeight: 500,
    // },
    // h4: {
    //   fontWeight: 600,
    // },
    // h5: {
    //   fontWeight: 600,
    // },
    subtitle1: {
      fontFamily: "Comfortaa",
      // fontWeight: 600,
    },
    body1: {
      fontWeight: 600,
      fontFamily: "Comfortaa",
    },
    body2: {
      fontWeight: 600,
      fontFamily: "Comfortaa",
    },
    fontFamily: [
      "Titillium Web",
      // "Comfortaa",
      // "Saira Semi Condensed",
      "sans-serif",
    ].join(","),
    button: {
      // fontFamily: "Comfortaa",
      // textTransform: "none" as const,
      fontWeight: 600,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
};

export const themeLight = createTheme({
  ...otherThemes,
  palette: {
    mode: "light",
    background: {
      default: "#fff",
    },
    text: {
      primary: "#21262E",
    },
    primary: {
      main: "#3b3a37",
      light: "#62615f",
      dark: "#292826",
    },
    secondary: {
      main: "#EEB405",
      light: "#f1c337",
      dark: "#a67d03",
    },
  },
});

export const themeDark = createTheme({
  ...otherThemes,
  palette: {
    mode: "dark",
    background: {
      default: "rgb(13, 17, 23)",
    },
    text: {
      primary: "#E5E5E5",
    },
    primary: {
      main: "#3b3a37",
      light: "#62615f",
      dark: "#292826",
    },
    secondary: {
      main: "#EEB405",
      light: "#f1c337",
      dark: "#a67d03",
    },
  },
});
