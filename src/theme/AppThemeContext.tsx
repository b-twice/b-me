import React, { useReducer } from "react";
import { ThemeProvider } from "@mui/styles";
import { createTheme, Theme, StyledEngineProvider } from "@mui/material/styles";

declare module "@mui/styles" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const lightTheme = createTheme({
  palette: {
    mode: "light",
    // primary: {
    //   main: "#ffffff",
    //   light: "#f4f5f7",
    // },
    // background: {
    //   default: "#ffffff",
    // }
    secondary: {
      main: "#2962ff",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#212121",
      // light: "#fafafa",
      light: "#333333",
    },
    secondary: {
      main: "#1Eb980",
      // main: '#045D56',
      // main: '#FF6859',
      // main: '#FFCF44',
      // main: '#B15DFF',
      // main: '#72DEFF',
    },
  },
});

type Action = { type: "LIGHT" | "DARK" };
const reducer = (state: Theme, action: Action): Theme => {
  console.log(state);
  switch (action.type) {
    case "LIGHT":
      console.log(lightTheme);
      return lightTheme;
    case "DARK":
      console.log(darkTheme);
      return darkTheme;
    default:
      return state;
  }
};

export default interface AppThemeContextProps {
  dispatch: React.Dispatch<Action>;
}

const AppThemeContext = React.createContext({} as AppThemeContextProps);

function AppThemeContextProvider({ children }: { children: JSX.Element }) {
  const [state, dispatch] = useReducer(reducer, lightTheme);

  const contextProps = {
    dispatch: dispatch,
  } as AppThemeContextProps;

  return (
    <AppThemeContext.Provider value={contextProps}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={state}>{children}</ThemeProvider>
      </StyledEngineProvider>
    </AppThemeContext.Provider>
  );
}

export { AppThemeContext, AppThemeContextProvider };

// type PaletteMode = 'light' | 'dark';
// const getDesignTokens = (mode: PaletteMode) => ({
//   palette: {
//     mode,
//     ...(mode === 'light'
//       ? {
//           // palette values for light mode
//           primary: amber,
//           divider: amber[200],
//           text: {
//             primary: grey[900],
//             secondary: grey[800],
//           },
//         }
//       : {
//           // palette values for dark mode
//           primary: {
//             main: "#212121",
//             // light: "#fafafa",
//             light: "#333333",
//           },
//           secondary: {
//             main: "#1Eb980",
//                 primary: deepOrange,
//           divider: deepOrange[700],
//           background: {
//             default: deepOrange[900],
//             paper: deepOrange[900],
//           },
//           text: {
//             primary: '#fff',
//             secondary: grey[500],
//           },
//         }),
//   },
// });

// const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

// export default function ToggleColorMode({
//   children,
// }: {
//   children: JSX.Element;
// }) {
//   const [mode, setMode] = React.useState<"light" | "dark">("light");
//   const colorMode = React.useMemo(
//     () => ({
//       toggleColorMode: () => {
//         setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
//       },
//     }),
//     []
//   );

//   const theme = React.useMemo(
//     () =>
//       createTheme({
//         palette: {
//           mode,
//         },
//       }),
//     [mode]
//   );

//   return (
//     <ColorModeContext.Provider value={colorMode}>
//       <ThemeProvider theme={theme}>{children}</ThemeProvider>
//     </ColorModeContext.Provider>
//   );
// }
