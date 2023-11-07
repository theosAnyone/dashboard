
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import  Link  from '@mui/material/Link';
import Checkbox from '@mui/material/Checkbox';

const moment = require('moment')



export default function UserInfosTable({bloc, handleCheckedDemo, demos_checked}) {

    const [selected_column,set_selected_column] = useState('')
    const [button_up,set_button_up] = useState(false)
    const [demos_checked_state, set_demos_checked_state ] = useState(demos_checked || [])
    const theme = useTheme()
    const currentTheme = theme.palette.mode
    
    const bloc_is_reviewed = bloc.hasOwnProperty("reviewed") ? (bloc.reviewed || Boolean(bloc.reviews.length)) : false
    console.log("bloc_is_reviewed:",bloc_is_reviewed);


    const handleSortClick = (id) => {
      set_selected_column(id)
      set_button_up(!button_up)
    }

    const handleCheckBoxes = (ex_id, e_is_checked) => {
      if(e_is_checked){
        set_demos_checked_state(ex_id)
      }
      handleCheckedDemo(ex_id,e_is_checked)
    }

    const columns = [
        {name:"exercice"},
        {name:"submission"},
        {name:"demo"},

    ]
    const column_cells = columns.map(column => {

      const color_icon_up = currentTheme === 'light' ?  (!button_up  ? '#000000' : '#9a9595') :  (!button_up  ? '#9a9595' : '#ffffff')
      const color_icon_down = currentTheme === 'light' ? (button_up  ? '#000000' : '#9a9595') : (button_up  ? '#9a9595' : '#ffffff')

        return <TableCell 
            key={column.name} 
            sx={{
                fontFamily:'Figtree',
                fontWeight:'700',
                width:'10%',
            }}

            > 
                <div className='table-cell' style={{display:'flex',justifyContent:'flex-start'}}>
                <span className="cell-title">{column.name}</span>
                    <div className="sort-icons-container" style={{display:'flex',alignItems:'center',justifyContent:'center', marginLeft:'10px',position:'sticky'}}>
                        <FontAwesomeIcon icon={faSortUp} style={{position:'absolute',cursor:'pointer'}} onClick={()=>{handleSortClick(column.name)}}  color={selected_column === column.name ? color_icon_up : currentTheme === 'light' ? '#000000' :'#9a9595'}/>
                        <FontAwesomeIcon icon={faSortDown} style={{position:'absolute',cursor:'pointer'}} onClick={()=>{handleSortClick(column.name)}} color={selected_column === column.name ? color_icon_down :  currentTheme === 'light' ? '#000000' :'#9a9595'}/>
                    </div>  
                </div>
            </TableCell>
    })
    return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
    <TableContainer sx={{maxHeight:380}}>
      <Table sx={{ minWidth: 650}} stickyHeader aria-label="simple table">
        <TableHead>
          <TableRow>
          {column_cells}
          </TableRow>
        </TableHead>
        <TableBody>
          {bloc.exercices.map((exercice,index) => {
            const date = moment(exercice.date)
            const formattedDate = date.format('MMM D YYYY HH:mm');
            const demo_checked = demos_checked.includes(exercice._id)
            return (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                
                <TableCell component="th" scope="row">
                  {exercice.name.charAt(0).toUpperCase() + exercice.name.slice(1)}
                </TableCell>
                <TableCell >
                  <div style={{display:'flex',flexDirection:'column'}}>
                  {exercice.link === 'no link' ? <span>no link</span>:<Link href={exercice.link} underline='always' fontWeight={600} style={{color:'blue'}} target="_blank" rel="noopener noreferrer">
                    {"See file"}
                  </Link>}
                  
                  <span style={{fontSize:12,fontWeight:400,color:'#6F6D76'}}>{formattedDate}</span>
                  </div>
                </TableCell>
                <TableCell >
                  <Checkbox disabled={bloc_is_reviewed} checked={demo_checked} onChange={(e)=>handleCheckBoxes(exercice._id,e.target.checked)} color='success'/>
                </TableCell>


              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
  );
}