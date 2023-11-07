import {store} from '../../app/store'
import { usersApiSlice } from '../users/usersApiSlice'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'


const Prefetch = () => {
  
    useEffect(()=>{

        store.dispatch(usersApiSlice.util.prefetch('getUsers','userList',{force:true}))

    },[])

    return <Outlet />
}

export default Prefetch

