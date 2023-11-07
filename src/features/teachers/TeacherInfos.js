
import { useEffect } from 'react'
import {  useParams } from 'react-router-dom'
import { teachersApiSlice } from './teachersApiSlice'
import Paper from '@mui/material/Paper';
import  CircularProgress  from '@mui/material/CircularProgress';
import EditTeacherInfos from './EditTeacherInfos';
// import EditTeacherInfos from './EditTeacherInfos'

const TeacherInfos = () => {

    const { id } = useParams()

    const { 
        data:teacher,
        isLoading,
        isSuccess,
        isError,
        isFetching,
        error
    } = teachersApiSlice.useGetTeacherByIdQuery(id, {
      refetchOnMountOrArgChange:true,
    })




    
    useEffect(() => {
        const handleBeforeUnload = (event) => {
          // Vous pouvez même empêcher l'utilisateur de quitter la page
          // en définissant une propriété returnValue sur l'objet d'événement.
          event.preventDefault();
          event.returnValue = "Voulez-vous vraiment actualiser ou quitter cette page ?";
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        // N'oubliez pas de supprimer l'écouteur d'événements pour éviter des fuites de mémoire
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, []);
    let content;
    if(isLoading || isFetching){
        content = <Paper sx={{width:'100vw',height:'100vh',display:'flex', flexDirection:'column',justifyContent:'center',alignItems:'center'}} >
            <p style={{fontSize:50}}>Loading</p>
            <CircularProgress size={60} color='success'/>
        </Paper>
    }
    if(isSuccess || teacher){
        content  =  <EditTeacherInfos teacher={teacher}/>
    }
    return content
}

export default TeacherInfos
