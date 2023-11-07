
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from './themeSlice'

import { IconButton } from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';


const ToogleThemeButton = () => {
  const currentTheme = useSelector((state) => state.theme)
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(toggleTheme())
  }
 
  const color = currentTheme === 'light' ? 'black' : 'white'
  
  return (
    <IconButton aria-label='toogle-theme' onClick={handleClick} sx={{color:{color}}}  >
      {currentTheme === 'light' ? <DarkModeIcon fontSize='large'  /> : <LightModeIcon fontSize='large'  /> }
    </IconButton>
  )
}

export default ToogleThemeButton
