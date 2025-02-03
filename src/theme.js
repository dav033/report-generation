// src/theme.js
import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9", // Azul claro para el tema oscuro
    },
    secondary: {
      main: "#f48fb1", // Rosa claro para el tema oscuro
    },
    background: {
      default: "#121212", // Fondo oscuro
      paper: "#1e1e1e", // Fondo de los componentes
    },
    text: {
      primary: "#ffffff", // Texto principal en blanco
      secondary: "#aaaaaa", // Texto secundario en gris claro
    },
  },
});

export default darkTheme;
