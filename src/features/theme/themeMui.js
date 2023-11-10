import { createTheme } from "@mui/material/styles";

const default_theme = createTheme()


export const lightTheme = createTheme({
  ...default_theme,
  palette: {
    mode: "light",
    typography: {
      fontFamily: '"Figtree", sans-serif',
    },
    primary: {
      main: "#ECEBEF",
    }, 
    text: {
      primary: "#000000",
      secondary: "#cccccc",
    },
    borderButton: {
      main: "#000000",
    },
    success: {
      main: "#4068ce",
    },
  },
});


export const darkTheme = createTheme({...default_theme,
  palette:{
    mode:'dark',
    typography: {
      fontFamily: '"Figtree", sans-serif',
    },
    primary: {
      main: '#1876d1',
    },
    text:{
      primary:"#ffffff",
      secondary:"#616161"
    },
    success:{
      main : '#4068ce'
    }
  }
})



