import Container  from '@mui/material/Container'
import  Box  from '@mui/material/Box'
import  Paper  from '@mui/material/Paper'
import  Button  from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import React, { useState } from 'react'
import  TextField  from '@mui/material/TextField'
import { useUpdateTeacherMutation } from './teachersApiSlice'
import { setInfos } from './TeacherSlice'
import { useDispatch } from 'react-redux'

const EditTeacherInfos = ({teacher}) => {


  const [first_name, set_first_name] = useState(teacher.first_name);
  const [last_name, set_last_name] = useState(teacher.last_name)
  const [anyone_profile, set_anyone_profile] = useState(teacher.anyone_profile ?? "")
  const [updateTeacher, {data, isLoading, isSuccess, isError, error}] = useUpdateTeacherMutation()

  const dispatch = useDispatch()

  const handleSave = async () => {
    if(!first_name || !last_name) return
    const payload = {
      teacher_id: teacher._id,
      first_name,
      last_name,
      anyone_profile,
      id: teacher._id,
    }
    const updatedTeacher = await updateTeacher(payload).unwrap()
    if(!updatedTeacher) return console.log("error no updatedTeacher")
    dispatch(setInfos({first_name, last_name, anyone_profile}))
    
  }

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 10,
          width: 400,
          height: 600,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 5,
        }}
      >
        <Box
          width={"100%"}
          key={"text_fields"}
          display={"flex"}
          flexDirection={"column"}
          gap={4}
        >
          <TextField
            label={"first name"}
            onChange={(e) => set_first_name(e.target.value)}
            value={first_name}
            fullWidth
            color="success"
          />
          <TextField
            label={"last name"}
            defaultValue={teacher.last_name}
            onChange={(e) => set_last_name(e.target.value)}
            value={last_name}
            fullWidth
            color="success"
          />
          <TextField
            fullWidth
            label={"anyone profile url"}
            onChange={(e) => set_anyone_profile(e.target.value)}
            value={anyone_profile}
            color="success"
          />
          <Button
            variant="outlined"
            fullWidth
            sx={{ minHeight: 47 }}
            color="success"
            onClick={handleSave}
            disabled={isLoading || !first_name || !last_name}
          >
            {isLoading ? <CircularProgress /> : "Save"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default EditTeacherInfos
