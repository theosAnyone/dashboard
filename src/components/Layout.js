import { Outlet } from 'react-router-dom'
import { Paper, ThemeProvider } from '@mui/material'
import { useSelector } from 'react-redux'
import { darkTheme, lightTheme } from '../features/theme/themeMui'

const Layout = () => {
   const theme_select = useSelector((state)=>state.theme) 
   const theme = theme_select === 'light' ? lightTheme : darkTheme
    return (
        <ThemeProvider theme={theme}>
                <Paper>
                    <Outlet />
                </Paper>
        </ThemeProvider>
    )
}
export default Layout