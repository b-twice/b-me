import { AuthProvider } from "./core/Auth";

import { BlogProvider } from "./blog/BlogContext";
import { CssBaseline } from "@mui/material";
import Main from "./Main";
import { Fragment } from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#ffffff", // white
      light: "#f4f5f7", //light grey
    },
    secondary: {
      // main: "#212121",
      main: "#2962ff", // blue
    },
  },
});

function App() {
  return (
    // <AppThemeContextProvider>
    // </AppThemeContextProvider>
    <ThemeProvider theme={theme}>
      <Fragment>
        <CssBaseline />
        <AuthProvider>
          <BlogProvider>
            <Main></Main>
          </BlogProvider>
        </AuthProvider>
      </Fragment>
    </ThemeProvider>
  );
}

export default App;
