
import { useEffect } from 'react'
import {  useParams } from 'react-router-dom'
import {  usersApiSlice } from './usersApiSlice'
import EditUserInfos from './EditUserInfos'

const UserInfos = () => {

    const { id } = useParams()

    
    const {data:user, isError, isLoading, error} = usersApiSlice.useGetUserByIdQuery(id,{
      refetchOnMountOrArgChange:true,
      pollingInterval:30000, 
    })



    console.log("user:",user);
    useEffect(()=>{

      console.log("USER_INFOS:",user);

    },[user])


    let content = <p>Loading...</p>
    if(isError) content = <p>ERROR {error.data.message}</p>
    if(user) content = <EditUserInfos user_init={user} />
    if(isLoading) content = <p>Loading...</p>
    

    
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

    return content
}

export default UserInfos
