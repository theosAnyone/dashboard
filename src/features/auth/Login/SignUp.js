import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import checkPasswordStandards from '../../../utils/functions/PasswordStandards'
import { useState, useEffect} from 'react';
import checkEmailStandards from '../../../utils/functions/EmailStandards';
import { useDispatch, useSelector } from 'react-redux';
import { darkTheme, lightTheme } from '../../../features/theme/themeMui';
import { ThemeProvider } from '@emotion/react';
import { setCredentials } from '../authSlice';
import { useSignUpMutation } from '../authApiSlice';
import CustomizedSnackbars from '../../../components/CustomizedSnackbar';

function Copyright(props) {

  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://anyone.fr/">
        Anyone
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}



const USER_REGEX = /^[A-Za-z\u00C0-\u017F]{3,20}$/;

export default function SignUp() {
  
  const [signUp, {
    isLoading,
    isSuccess,
    isError,
    error
}] = useSignUpMutation()

  const theme = useSelector(state => state.theme)
  const currentTheme = theme === "light" ? lightTheme : darkTheme
  const navigate = useNavigate()

  const dispatch = useDispatch()
 
  const [secret_key, set_secret_key ] = useState("")

  const [first_name, setFirst_name] = useState('')
  const [validFirst_name, setValidFirst_name] = useState(false)

  const [last_name, setLast_name] = useState('')
  const [validLast_name, setValidLast_name] = useState(false)

  const [email, set_email] = useState('')
  const [valid_email, set_valid_email] = useState(false)

  const [password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)

  const [cgu_checked, set_cgu_checked] = useState(false)
  const [fields_errors, set_fields_errors] = useState([])

  const [snackBar_content, set_snackBar_content] = useState(null)

  useEffect(() => {
      const vfirstName = USER_REGEX.test(first_name)
      setValidFirst_name(vfirstName)

  }, [first_name])

  useEffect(() => {
    setValidLast_name(USER_REGEX.test(last_name))
}, [last_name])

  useEffect(() => {
      const email_standards = checkEmailStandards(email)
      set_valid_email(email_standards.res)
  }, [email])

  useEffect(() => {
      const password_standards = checkPasswordStandards(password)
      setValidPassword(password_standards.res)
  }, [password])

  useEffect(() => {
      if (isSuccess) {
          setFirst_name('')
          setLast_name('')
          setPassword('')
          navigate('/users')
      }
  }, [isSuccess, navigate])

  const onFirst_nameChanged = e => setFirst_name(e.target.value)
  const onLast_nameChanged = e => setLast_name(e.target.value)
  const onPasswordChanged = e => setPassword(e.target.value)
  const onEmailChanged = e => set_email(e.target.value)
  const onSecretKeyChange = e => set_secret_key(e.target.value)
  

  const canSave = [validFirst_name, validLast_name, validPassword, valid_email, secret_key].every(Boolean) && !isLoading

  const onSignup = async (e) => {
      e.preventDefault()
      if (canSave) {
          const first_name_threated = first_name.charAt(0).toUpperCase() + first_name.slice(1).toLowerCase()
          const last_name_threated = last_name.charAt(0).toUpperCase() + last_name.slice(1).toLowerCase()
        try {
          const {accessToken, teacher_id} = await signUp({ first_name:first_name_threated, last_name:last_name_threated, email, password, secret_key }).unwrap()
          dispatch(setCredentials({ accessToken, teacher_id
          }))
          
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

          


      }
      
  }
  


  return (
    <ThemeProvider theme={currentTheme}>
      {snackBar_content}
      <Container component="main" maxWidth="xs" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Inscription
          </Typography>
          <Box component="form" noValidate onSubmit={onSignup} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Prenom"
                  autoFocus
                  focused={!validFirst_name}
                  onChange={onFirst_nameChanged}
                  color={validFirst_name ? "success" : "error"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Nom"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={onLast_nameChanged}
                  color={validLast_name ? "success" : "error"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  onChange={onEmailChanged}
                  color={valid_email ? "success" : "error"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Mot de passe"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={onPasswordChanged}
                  color={validPassword ? "success" : "error"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="secretKey"
                  label="Secret Key"
                  type="password"
                  id="secretKey"
                  autoComplete="new-password"
                  onChange={onSecretKeyChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      value="allowExtraEmails"
                      color="success"
                      checked={cgu_checked}
                      onChange={() => set_cgu_checked(!cgu_checked)}
                    />
                  }
                  label="J'ai lu et j'accepte les conditions generale d'utilisations"
                />
              </Grid>
            </Grid>
            {fields_errors}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!canSave}
              color="success"
            >
              Inscription
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signin" variant="body2" color={"text.primary"}>
                  J'ai deja un compte
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}