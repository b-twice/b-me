import { AuthProvider } from "./core/Auth";

import { CssBaseline } from "@mui/material";
import Main from "./Main";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#ffffff", // white
      light: "#f4f5f7", //light grey
    },
    secondary: {
      main: "#2962ff", // blue
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <>
        <CssBaseline />
        <AuthProvider>
          <Main></Main>
        </AuthProvider>
      </>
    </ThemeProvider>
  );
}

export default App;
