
import InputBase from '@mui/material/InputBase';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSearch } from '../../components/SearchBarSlice';

const UserTableFIlterSearchBar = () => {
    
    const dispatch = useDispatch();
    const [value, set_value] = useState('')

    useEffect(()=>{
        const value_splitted = value.split('')
        dispatch(setSearch(value_splitted))
    },[value])

  return (
    <InputBase
    sx={{ 
        ml: 1,
        height:'40px',
        border:'solid 1px',
        borderRadius:'20px',
        textAlign:'right',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        paddingLeft:'20px'
    }}
    color="error"
    placeholder="Search..."
    inputProps={{ 'aria-label': 'search google maps' }}
    onChange={(e) => set_value(e.target.value) }
  />
  )
}

export default UserTableFIlterSearchBar
