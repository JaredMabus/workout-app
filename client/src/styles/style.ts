import { createTheme, responsiveFontSizes, alpha } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import {
  PaletteColorOptions,
  SimplePaletteColorOptions,
} from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    custom: Palette["primary"];
    surface: Palette["primary"];
    border: Palette["primary"];
  }

  interface PaletteOptions {
    custom: PaletteOptions["primary"];
    surface: PaletteOptions["primary"];
    border?: Palette["primary"];
  }
}

let otherThemes = {
  typography: {
    subtitle1: {
      fontFamily: "Comfortaa",
    },
    body1: {
      fontFamily: "Comfortaa",
      fontWeight: 600,
    },
    body2: {
      fontFamily: "Comfortaa",
      fontWeight: 600,
    },
    fontFamily: ["Titillium Web", "Comfortaa", "sans-serif"].join(","),
    button: {
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

export let themeLight = createTheme({
  ...otherThemes,
  palette: {
    mode: "light",
    primary: {
      main: "#3b3a37",
      light: "#62615f",
      dark: "#292826",
      contrastText: "#E5E5E5",
    },
    secondary: {
      main: "#EEB405",
      light: "#f1c337",
      dark: "#a67d03",
      contrastText: "#21262E",
    },
    custom: {
      dark: grey[400],
      main: grey[200],
      light: grey[100],
    },
    surface: {
      dark: grey[400],
      main: "#fff",
      light: grey[100],
    },
    border: {
      dark: grey[400],
      main: grey[300],
      light: grey[200],
      contrastText: "#21262E",
    },
    text: {
      primary: "#21262E",
      secondary: alpha("#21262E", 0.6),
    },
    background: {
      default: alpha(grey[100], 1),
      paper: "#fff",
    },
  },
});

themeLight = responsiveFontSizes(themeLight);

export let themeDark = createTheme({
  ...otherThemes,
  palette: {
    mode: "dark",
    primary: {
      main: "#3b3a37",
      light: "#62615f",
      dark: "#292826",
      contrastText: "#E5E5E5",
    },
    secondary: {
      main: "#EEB405",
      light: "#f1c337",
      dark: "#a67d03",
      contrastText: "#21262E",
    },
    custom: {
      dark: grey[900],
      main: grey[800],
      light: grey[700],
    },
    surface: {
      dark: "#2D2E31",
      main: "#121212",
      light: "#121212",
    },
    border: {
      dark: grey[500],
      main: grey[800],
      light: grey[900],
      contrastText: "#21262E",
    },
    text: {
      primary: "#E5E5E5",
      secondary: alpha("#E5E5E5", 0.8),
    },
    background: {
      default: "#121212",
      paper: "#2D2E31",
    },
  },
});

themeDark = responsiveFontSizes(themeDark);
