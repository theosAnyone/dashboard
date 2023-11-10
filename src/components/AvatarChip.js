import { DarkModeOutlined } from '@mui/icons-material';
import LightMode from '@mui/icons-material/LightMode';
import { Button, ButtonGroup, ListItemButton, Menu, MenuItem } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import { toggleTheme } from '../features/theme/themeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';
import { useGetTeacherByIdQuery } from '../features/teachers/teachersApiSlice';
import { selectTeacherId } from '../features/auth/authSlice';

const AvatarChip = () => {
    
    const dispatch = useDispatch()

    const theme = useSelector((state) => state.theme)

    const [anchorEl, setAnchorEl] = useState(null);
    
    const teacher_id = useSelector(state => selectTeacherId(state)) 
    const [teacher_data, set_teacher_data] = useState(null)

    const navigate = useNavigate()

    const [sendLogout,{
      isLoading,
      isSuccess,
      isError,
      error
    }] = useSendLogoutMutation()

    const {
      data:teacher,
      isSuccess:teacherIsSucces,
      isLoading:teacherIsLoading,
      isFetching:teacherIsFetching,
      isError:teacherIsError,
      error:teacherError,
    } = useGetTeacherByIdQuery(teacher_id)
    

    useEffect(()=>{
      if (isSuccess) navigate('/')
    },[isSuccess, navigate])

    useEffect(()=>{
      if(!teacher || !teacherIsSucces)return
      set_teacher_data(teacher)
    },[teacherIsSucces,teacher])

    if(isLoading) return <p>Logging out...</p>

    if(isError) return <p> Error: {error.data?.message}</p>

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleLightClick = () => {
        if(theme !== 'light')
        dispatch(toggleTheme())
    };

    const handleDarkClick = () => {

        if(theme !== 'dark')
        dispatch(toggleTheme())
    };

    const goProfile = () => {
      navigate(`/teacher/${teacher_id}`)
    }
  return (
    <Stack
         direction="row" 
         spacing={1}
         alignItems={"center"}
         justifyContent={"center"}
         width={'200px'}
    >

      <Chip
        avatar={<Avatar alt="Natacha" src="/static/images/avatar/1.jpg" />}
        label={teacher_data?.first_name}
        variant="outlined"
        onClick={handleClick}
        clickable={true}
        

      />
    <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleClose}
        
        slotProps={{paper:{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            width:300,
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >


            <ButtonGroup aria-label="outlined button group" sx={{display:'flex',justifyContent:'center'}}>
                <Button  startIcon={<LightMode/>} onClick={handleLightClick} sx={{borderRadius:'15px',textTransform:'none'}} color='success' defaultValue={"Light"} >Light</Button>
                <Button  startIcon={<DarkModeOutlined/>} onClick={handleDarkClick} sx={{borderRadius:'15px',textTransform:'none',border:theme === 'light' ? '1px solid black' : '1 px solid grey' , color:theme === 'light' ? 'black' : 'grey'}} defaultValue={"Dark"} >Dark</Button>
            </ButtonGroup>

        <MenuItem onClick={handleClose} sx={{display:'flex',alignItems:'center',justifyContent:'center',width:175,borderRadius:8,height:40, mt:2}}>
          <Button 
            variant='outlined'
            sx={{borderRadius:4, minWidth:175, textTransform:'none'}} 
            color='success'
            onClick={sendLogout}
          >
            Logout
          </Button>
        </MenuItem>

        <MenuItem onClick={handleClose} sx={{display:'flex',alignItems:'center',justifyContent:'center',width:175,borderRadius:8,height:40, mt:2}}>
        <Button 
            variant='outlined'
            sx={{borderRadius:4, minWidth:175, textTransform:'none'}} 
            color='success'
            onClick={goProfile}
          >
            Profile
          </Button>
        </MenuItem>
      </Menu>

    </Stack>
  )
}

export default AvatarChip
