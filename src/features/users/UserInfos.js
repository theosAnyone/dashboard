
import { useEffect } from 'react'
import {  useParams } from 'react-router-dom'
import { usersApiSlice } from './usersApiSlice'
import EditUserInfos from './EditUserInfos'

const UserInfos = () => {

    const { id } = useParams()

    const { user } = usersApiSlice.useGetUsersQuery("userList", {
      selectFromResult: ({ data }) => ({
        user: data?.entities[id]
      }),
      refetchOnMountOrArgChange:true,
      pollingInterval:30000,
    })


    const content = user ? <EditUserInfos user={user} /> : <p>Loading...</p>
    
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