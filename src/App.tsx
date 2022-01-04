import { AuthProvider } from "./core/Auth";

import { BlogProvider } from "./blog/BlogContext";
import { CssBaseline } from "@material-ui/core";
import Main from "./Main";
import { AppThemeContextProvider } from "./theme/AppThemeContext";
import { Fragment } from "react";

function App() {
  return (
    <AppThemeContextProvider>
      <Fragment>
        <CssBaseline />
        <AuthProvider>
          <BlogProvider>
            <Main></Main>
          </BlogProvider>
        </AuthProvider>
      </Fragment>
    </AppThemeContextProvider>
  );
}

export default App;
