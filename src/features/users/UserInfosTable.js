
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import  Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import exercice1 from '../../img/exercice1.png'
import exercice2 from '../../img/exercice2.png'
import exercice3 from '../../img/exercice3.png'
import exercice4 from '../../img/exercice4.png'
import exercice5 from '../../img/exercice5.png'
import exercice6 from '../../img/exercice6.png'
import exercice7 from '../../img/exercice7.png'
import exercice8 from '../../img/exercice8.png'
import exercice9 from '../../img/exercice9.png'
import exercice10 from '../../img/exercice10.png'
import exercice11 from '../../img/exercice11.png'
import exercice12 from '../../img/exercice12.png'
import exercice13 from '../../img/exercice13.png'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import  Link  from '@mui/material/Link';
import Checkbox from '@mui/material/Checkbox';

const moment = require('moment')

const exName_img = {
  'exercice1':exercice1,
  'exercice2':exercice2,
  'exercice3':exercice3,
  'exercice4':exercice4,
  'exercice5':exercice5,
  'exercice6':exercice6,
  'exercice7':exercice7,
  'exercice8':exercice8,
  'exercice9':exercice9,
  'exercice10':exercice10,
  'exercice11':exercice11,
  'exercice12':exercice12,
  'exercice13':exercice13,


}

export default function UserInfosTable({bloc, handleCheckedDemo, demos_checked}) {

    const [selected_column,set_selected_column] = useState('')
    const [button_up,set_button_up] = useState(false)
    const [demos_checked_state, set_demos_checked_state ] = useState(demos_checked || [])
    const [img_src, set_img_src] = useState("../../img/background.jpg")
    const [modal_open, set_modal_open] = useState(false)
    const theme = useTheme()
    const currentTheme = theme.palette.mode
    
    const bloc_is_reviewed = bloc.hasOwnProperty("reviewed") ? (bloc.reviewed || Boolean(bloc.reviews.length)) : false


    const handleSortClick = (id) => {
      set_selected_column(id)
      set_button_up(!button_up)
    }

    const handleCheckBoxes = (ex_id, e_is_checked) => {

      console.log("e_is_checked:",e_is_checked);

      if(e_is_checked){
        set_demos_checked_state([...demos_checked_state, ex_id])
        handleCheckedDemo([...demos_checked_state, ex_id]);
      } else if (!e_is_checked){
        const demos_checked_filtered = demos_checked_state.filter(ex => ex !== ex_id)
        set_demos_checked_state(demos_checked_filtered)
        handleCheckedDemo(demos_checked_filtered)
      }
      

      console.log("set_demos_checked_state:",demos_checked_state);
    }

    const handleExClick = (exName) => {
      set_img_src(exName_img[exName])
      set_modal_open(true)
    }

    const handleCorrClick = (exLink) => {
      window.open(exLink, '_blank', 'noopener,noreferrer');
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
      <Modal open={modal_open} onClose={()=>set_modal_open(false)} >
        <img src={img_src} alt='consignes' height={'60%'} width={'30%'} style={{position:'absolute', top:'20%', right:'40%'}}/>
      </Modal>
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
            const ex_is_correction =  exercice.name.includes("correction")
            return (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                
                <TableCell component="th" scope="row"  onClick={()=> { ex_is_correction ? handleCorrClick(exercice.link) : handleExClick(exercice.numberName) }}>
                  <span style={{cursor:'pointer'}}>{exercice.name.charAt(0).toUpperCase() + exercice.name.slice(1)}</span>
                </TableCell>
                <TableCell >
                  <div style={{display:'flex',flexDirection:'column'}}>
                  {exercice.link === 'no link' ? <span>no link</span> : <Link href={exercice.link} underline='always' fontWeight={600} style={{color:'blue'}} target="_blank" rel="noopener noreferrer">
                    {"See file"}
                  </Link>}
                  
                  <span style={{fontSize:12,fontWeight:400,color:'#6F6D76'}}>{formattedDate}</span>
                  </div>
                </TableCell>
                <TableCell >
                  { !ex_is_correction &&
                    <Checkbox 
                    disabled={bloc_is_reviewed} 
                    checked={demo_checked} 
                    onChange={(e)=>handleCheckBoxes(exercice._id,e.target.checked)} 
                    color='success'
                    sx={{color:'#4068ce'}}
                    />
                  }

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