import FormControl from '@mui/material/FormControl';

import Select from '@mui/material/Select';
import {  useState } from 'react';

const UserTableFilterButton = ({id,label,minWidth,marginLeft,onchange,menu_items,title,forceValue=false,force_render_value=false}) => {
    
    const [value,set_value] = useState(title)

    const handleValueCheck = (e) => {
        console.log("VALUE:",e.target.value);
        set_value(e.target.value)
        if(e.target.value === ''){
            onchange && onchange('none')
        }else{
             onchange && onchange(e.target.value)
        }
        
        
    }

  return (
    <FormControl
        size="small" 
        sx={{minWidth:minWidth||0,marginLeft:marginLeft||0,border:'none'}}
    >
        <Select 
            id={id}
            sx={{borderRadius:'20px'}}
            value={forceValue ? forceValue :  value}
            onChange={(e) => {handleValueCheck(e)} }
            displayEmpty
            renderValue={
                    (value) => value ? value :  force_render_value ? force_render_value : label
                }
        >
            {menu_items}
        </Select>
    </FormControl>
  )
}

export default UserTableFilterButton
