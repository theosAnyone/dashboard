import { useSelector } from "react-redux";
import {  useGetUsersQuery } from "./usersApiSlice"


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Avatar, Chip, LinearProgress  } from "@mui/material"


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";

import { sortUsers } from "../../utils/functions/SortUsers";

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';


import FetchFailedSvg from "../../img/FetchFailedSvg";

import FetchFailedSvgDark from "../../img/FetchFailedSvgDark";
import CustomizedSnackbars from "../../components/CustomizedSnackbar";
import NoResultSvg from "../../img/NoResultSvg";


function transform_users_data(users){
  const user_transformed_data = users.map(user => {
        
    const name = user.Discord_Infos.displayName
    const img = user.Discord_Infos.avatar_url || require('../../img/discord.svg')

    let one_good = false;
    let one_wrong = false;

    for(const key in user.Student_Perks){
      const actual = user.Student_Perks[key]
      if(key === "_id") continue
      if(!Array.isArray(actual)){
        console.log('ERROR IS NOT ARRAY');
        continue
      }
      if(!actual.length){
        one_wrong = true;
      } else {
        one_good = true;
      }
    }

    const status = user.Journey_Infos.blocs?.length ?  (user.Journey_Infos.blocs.some(bloc=>(!bloc.reviewed && !bloc.reviews?.length)&& bloc.completed) ? "Not reviewed" : user.Journey_Infos.blocs.some(bloc=>!bloc.reviewed) ? 'In progress' : user.Journey_Infos.progress === 19 ? 'Finished' : 'Reviewed') : 'Just started';
    const fiche_state_color = (one_good && one_wrong) ? '🟠' : !one_wrong ? '🟢' : '🔴' ;
    const progress = user.Journey_Infos.progress
    const subscription = user.Discord_Infos.grade
    const user_id = user._id
    
    return {name, status, fiche_state_color, progress, img, subscription, user_id}

  })
  return user_transformed_data
}


export default function UserList({filter_functions,passRowsLength, handleClearFilters}) {


    const {
        data:getUserlistdata,
        isLoading,
        isSuccess,
        isError,
        isFetching,
        error
    } = useGetUsersQuery('userList',{
      pollingInterval: 60000,
    })

    const navigate = useNavigate()



    const search = useSelector( (state) => state.search)
    const currentTheme = useSelector((state)=> state.theme)

    const [users,set_users] = useState([])
    const [users_transformed, set_users_transformed] = useState([])

    const [rows,set_rows] = useState(users_transformed)
    const [selected_column,set_selected_column] = useState(null)

    const [button_up, set_button_up] = useState(false)

    const color_icon_up = currentTheme === 'light' ?  (!button_up  ? '#000000' : '#9a9595') :  (!button_up  ? '#9a9595' : '#ffffff')
    const color_icon_down = currentTheme === 'light' ? (button_up  ? '#000000' : '#9a9595') : (button_up  ? '#9a9595' : '#ffffff')


    useEffect(()=>{
      if(isSuccess && getUserlistdata && !isFetching){

        const users = getUserlistdata.ids.map((id) => getUserlistdata.entities[id])
        set_users(users)

      }
    },[isSuccess,getUserlistdata,isFetching])

    useEffect(()=>{

      if(!users?.length) return

      const transformed_user_data = transform_users_data(users)
      set_users_transformed(transformed_user_data)

    },[users])

    useEffect(()=>{
      if(isFetching)return
      const users_init = getUserlistdata.ids.map(id=>getUserlistdata.entities[id])
      if(!search?.length){
        set_users(users_init)
        return;
      }

      const perfect_match = users_init.filter(user =>  user.Discord_Infos.displayName.toLowerCase() === search.join('').toLowerCase())

      const users_filtered_by_search =  users_init.filter(user => search.every(char => user.Discord_Infos.displayName.toLowerCase().includes(char.toLowerCase())))

      const users_filtered_and_perfect_match = Array.from(new Set([...perfect_match,...users_filtered_by_search]))
      
      set_users(users_filtered_and_perfect_match)

    },[search,isFetching])


    
    useEffect(()=>{

      if(filter_functions?.length && users_transformed){
        let users_filtered_by_filters = users_transformed;
        let users_filtered_by_filter;
        
        for(const filter of filter_functions){
          users_filtered_by_filter =  users_filtered_by_filters.filter(filter);
          users_filtered_by_filters = users_filtered_by_filter;  // mise à jour après chaque itération

        }
        set_rows(users_filtered_by_filter)
      } else {
        set_rows(users_transformed)
      }
    },[filter_functions,users_transformed])

    const handleRowClick = (user_id) => {
      navigate(`/users/${user_id}`)
    }

    const handleSortClick = (id) => {

      const sort_criteria = {
        name:{
          type: 'alphabetical',
          to_sort: "name"
        },
        subscription : {
          type:'unique',
          to_sort:'subscription',
          object_value:{
            'Pro':2,
            'Carriere':0,
            'Demo':1,
          }

        },
        status:{
          type: 'unique',
          to_sort: "status",
          object_value:{
              'In progress':3,
              'Reviewed':2,
              'Not reviewed':4,
              'Just started':1,
              'Finished':0
          }
        },
        fiche_state:{
          type: 'unique',
          to_sort: "fiche_state_color",
          object_value:{
              '🟠':2,
              '🟢':1,
              '🔴':3,

          }
        },
        progress:{
          type: 'number',
          to_sort: "progress",
        },
      }

      set_selected_column(id)
      set_button_up(!button_up)

      if(!sort_criteria[id]) return console.log("Error sorting object id")

      const order = !button_up 
      const sort_func = sortUsers(sort_criteria[id], order) && sortUsers

      if(!sort_func) return console.log("Sort function encountered a problem")

      const users_sorted = [...rows].sort(sortUsers(sort_criteria[id], order))
      set_rows(users_sorted)
    }

    const handleClearFiltersHere = () => {
      handleClearFilters()
      set_rows(users_transformed)
    }



    if(isError) {
        if(error.status === "FETCH_ERROR"){
          return currentTheme === "light" ? 
            <div>
              <CustomizedSnackbars message={"Error sending vocal"} severity={"error"}  />
              <FetchFailedSvg/>
            </div> : 
            <div>
              <CustomizedSnackbars message={"Error sending vocal"} severity={"error"}  />
              <FetchFailedSvgDark/>
            </div>
        }
        
    }
      const rows_map = set_rows_func(rows)
      passRowsLength(rows?.length ? rows.length : 0)

      const rows_loading_map = set_rows_loading_func()

      const columns = [
          { id: 'name', label: 'Name', minWidth:100 },
          { id: 'subscription', label: 'Subscription', minWidth:100 },
          { id: 'status', label: 'Status', minWidth:100,align:'inherit',sortDirection:'asc' },
          {
              id: 'fiche_state',
              label: 'fiche',
              minWidth:100,
              align: 'inherit',
              // format: (value) => value.toLocaleString('en-US'),
          },
          {
              id: 'progress',
              label: 'prog',
              align: 'right',
              // format: (value) => value.toLocaleString('en-US'),
          },
      ];

      const VirtuosoTableComponents = {

        Scroller: React.forwardRef((props, ref) => (
            <TableContainer component={Paper} {...props} ref={ref} />
        )),
        Table: (props) => (

            <Table {...props} sx={{ borderCollapse: 'separate' }} />

        ),
        TableHead,
        TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
        TableBody: React.forwardRef((props, ref) =><TableBody {...props} ref={ref} />)

      };


      const fixedHeaderContent = () => {
      return (

          <TableRow >
          {columns.map((column) => (
              <TableCell
              key={column.id}
              sx={{
                  backgroundColor: 'background.paper',
                  fontFamily:'Figtree',
                  fontWeight:'700',
                  width:'10%',
              }}
              >
                  
                  <div className="table-cell" style={{display:'flex',justifyContent:column.id === 'progress' ? 'flex-end' : 'flex-start', marginRight:column.id === 'progress'? 150 :0}}>
                      <span className="cell-title">{column.label}</span>
                      <div className="sort-icons-container" style={{display:'flex',alignItems:'center',justifyContent:'center', marginLeft:'10px'}}>
                          <FontAwesomeIcon icon={faSortUp} style={{position:'absolute',cursor:'pointer'}} onClick={()=>{handleSortClick(column.id)}} color={selected_column === column.id ? color_icon_up : currentTheme === 'light' ? '#000000' :'#9a9595'}/>
                          <FontAwesomeIcon icon={faSortDown} style={{position:'absolute',cursor:'pointer'}} onClick={()=>{handleSortClick(column.id)}} color={selected_column === column.id ? color_icon_down :  currentTheme === 'light' ? '#000000' :'#9a9595'}/>
                      </div>
                  </div>
              </TableCell>
          ))}
          </TableRow>
          
      );
      }

      const rowContent = (_index, row) => {
      return (
          <React.Fragment>
          {columns.map((column) => (
              <TableCell
              key={column.id}
              onClick={()=>handleRowClick(row.user_id)}
              >
              {row[column.id]}
              </TableCell>
          ))}
          </React.Fragment>
      );
      }




    if (isLoading || isFetching || !rows) return (
      <div className="table-container">
      <Paper style={{ height: 640, width: '100%',marginTop:20 }}>
        <TableVirtuoso
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
          data={rows_loading_map}
        />
      </Paper>
      </div>
    )

    else{
      return rows.length ? (
        <div className="table-container">
        <Paper style={{ height: 640, width: '100%',marginTop:20 }}>
          <TableVirtuoso
            data={rows_map}
            components={VirtuosoTableComponents}
            fixedHeaderContent={fixedHeaderContent}
            itemContent={rowContent}
          />
        </Paper>
        </div>
      ) : <div style={{width:'100%',height:'70%',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <NoResultSvg handleClearFiltersClick={handleClearFiltersHere}/>
          </div>
    }



    

}



function set_rows_func(rows){

      const rows_map = rows?.length ? rows.map(row => {
        const sub_chip_obj = {
          Pro:<Chip label="Pro" clickable={true} sx={{background:'linear-gradient(112.91deg, #FF022F 0%, #3700D2 94.35%)', color:'white'}}/>,
          Carriere:<Chip label="Carriere" clickable={true} sx={{background:'linear-gradient(112.91deg, #000000 0%, #9a9595 94.35%)', color:'white'}}/>,
          Demo:<Chip label="Demo" clickable={true} sx={{background:'linear-gradient(90deg, rgba(9,121,13,1) 0%, rgba(0,255,9,1) 87%);', color:'white'}}/>
        }
          
        const sub_chip = sub_chip_obj[row.subscription]

        const status_options = {
          "Not reviewed":<Chip sx={{background:"linear-gradient(80deg, rgba(149,2,2,1) 20%, rgba(254,25,25,1) 100%)",color:'white'}} label="Not reviewed" />,
          "Reviewed":<Chip sx={{background:"linear-gradient(80deg, rgba(2,149,14,1) 20%, rgba(25,254,44,1) 100%)",color:'white'}} label="Reviewed"/>,
          "In progress":<Chip sx={{backgroundColor:"#ECEBEF",color:'black'}} label="In progress"/>,
          "Just started":<Chip sx={{background:"linear-gradient(65deg, rgba(232,206,2,1) 28%, rgba(248,255,0,1) 100%)",color:'black'}} label="Just started"/>,
          "Finished":<Chip sx={{background:"linear-gradient(90deg, rgba(1,15,82,1) 4%, rgba(87,135,249,1) 98%)",color:'white'}} label="Finished"/>
        }

        const status_chip = status_options[row.status]

        const name = <div  className="row-container" style={{width:150}}><Avatar alt={row.name} src={row.img} variant="square" sx={{borderRadius:'5px'}} /><span className="row-name">{row.name}</span></div>
        
        const subscription = <div className="row-sub" >{sub_chip}</div>


        const status = <div >{status_chip}</div>
        const fiche_state = <div >{row.fiche_state_color}</div>
        const progress_percent = (row.progress /19) * 100
        const progress_bar_color = ((row.progress /19) * 100) !== 100 ? 'secondary' :'success'

        const progress = <div className="table-row-progress-and-value" style={{display:'flex',alignItems:'center',justifyContent:'flex-end',width:'100%',marginRight:150}}> <LinearProgress variant="determinate"  value={progress_percent} color={progress_bar_color} sx={{width:'100%',borderRadius:'5px',height:'6px'}}/> <span style={{fontFamily:'Figtree',marginLeft:'3px',marginRight:150}}>{row.progress}</span></div>
        const key = row.user_id
        const user_id = row.user_id
        return {name, subscription, status, fiche_state, progress, key, user_id}

      })
      :
      null
      return rows_map
}

function set_rows_loading_func(){

          const name = <Stack spacing={0.5} direction={"row"} alignItems={"center"} justifyContent={"center"}> 
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rounded" width={50} height={20} />
            </Stack>
          const subscription = <Skeleton variant="rounded" width={100} height={20} />
          const status = <Skeleton variant="rounded" width={100} height={20} />
          const fiche_state = <Skeleton variant="circular" width={10} height={10} />
          const progress = <Skeleton variant="rounded" width={200} height={10} />
          const key = Date.now()
          const user_id = null
          const obj_loading =  {name, subscription, status, fiche_state, progress, key, user_id}
          const array = new Array(500).fill(obj_loading)
          return array
}