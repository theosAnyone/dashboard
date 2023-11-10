import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { ThemeProvider } from '@emotion/react';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

import { useSelector } from 'react-redux/es/hooks/useSelector';
import { darkTheme, lightTheme } from '../../../features/theme/themeMui';
import checkEmailStandards from '../../../utils/functions/EmailStandards';
import checkPasswordStandards from '../../../utils/functions/PasswordStandards';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useLoginMutation } from '../authApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../authSlice';
import usePersist from '../../../hooks/usePersist';
import CustomizedSnackbars from '../../../components/CustomizedSnackbar';
import { setInfos } from '../../teachers/TeacherSlice';
import { useGetTeacherByIdQuery } from '../../teachers/teachersApiSlice';

function Copyright(props) {

  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Anyone
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.



export default function SignIn() {

  const currentTheme = useSelector((state)=>state.theme)
  const theme = currentTheme === 'light' ? lightTheme : darkTheme
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email_color,set_email_color] = useState('')
  const [password_color,set_password_color] = useState('')
  const [snackBar_content, set_snackBar_content] = useState(null)
  const [login, {isLoading}] = useLoginMutation()
  const [persist, set_persist] = usePersist()




  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get('email')
    const password = data.get('password')
    const remember = data.get('remember')

    set_persist(prev => remember)



    if(!checkEmailStandards(email).res || !checkPasswordStandards(password).res){
      set_snackBar_content(<CustomizedSnackbars message={"Wrong email or password synthaxe"} severity={"error"} />)
      return
    }
    try {

      const {accessToken, teacher } = await login({email, password}).unwrap()

      
      dispatch( setCredentials({ accessToken, teacher_id : teacher._id }) )
      dispatch( setInfos( {
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        anyone_profile: teacher.anyone_profile,
      } ))
      set_email_color('success')
      set_password_color('success')
      navigate('/users')

    } catch (error) {

      if (!error.status){
        set_snackBar_content(<CustomizedSnackbars message={"No server response"} severity={"error"} />)
      } else if (error.status === 400) {

        set_snackBar_content(<CustomizedSnackbars message={"Missing username or password"} severity={"error"} />)
      } else if (error.status === 401) {
        set_snackBar_content(<CustomizedSnackbars message={"Unauthorized"} severity={"error"} />)
      } else {
        set_snackBar_content(<CustomizedSnackbars message={error.data?.message} severity={"error"} />)
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
    {snackBar_content}
      <Container component="main" maxWidth="xs" sx={{height:"100vh"}} >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              color={email_color}
              focused={email_color === 'error'}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              color={password_color}
              focused={password_color === 'error'}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="success" defaultChecked={persist}  />}
              label="Trust this device"
              id='remember'
              name='remember'
            />

            { isLoading ? <CircularProgress /> :
              <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color='success'
              >
               Sign In
              </Button>
            }

          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}