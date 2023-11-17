import UserInfosTable from '../features/users/UserInfosTable';

import UserTableFilterButton from '../features/users/UserTableFilterButton';
import UserTags from '../features/users/UserTags';
import {  useGetUserReviewsQuery } from '../features/reviews/ReviewApiSlice';


import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import  Divider  from '@mui/material/Divider';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import styled from '@emotion/styled';
import  MenuItem from '@mui/material/MenuItem';
import  Chip  from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';

import useAuth from '../hooks/useAuth';
import Button  from '@mui/material/Button';
import Menu from '@mui/material/Menu';



function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function setExChoose(number,name){
  return (
    <div key={name} style={{cursor:'pointer'}} >
    <span style={{color:'#6F6D76',fontWeight:500,cursor:'pointer'}}>Bloc {number}</span>
    <span style={{fontWeight:500,fontSize:18,marginLeft:4,cursor:'pointer'}}> {name}</span>
    </div>

  )
}




export default function TabPanel({
  row_progress, 
  user, 
  transmit_demo_to_EditUserInfos,
  transmit_tags_to_EditUserInfos,
  pass_bloc_reviewed_to_parent,
  pass_bloc_name_to_parent,
  handleChangeMenuItemClick,
  change_status_fullfiled,
}) {




  const {data: UserReviews, isLoading: UserReviewsAreLoading, isSuccess: UserReviewsAreSuccess, isFetching:UserReviewsAreFetching, isError: UserReviewsAreError, error: UserReviewsError} = useGetUserReviewsQuery(user._id)

  const [blocs, set_blocs] = useState(user.Journey_Infos.blocs)
  const [user_is_starting, set_user_is_starting] = useState(!blocs.length)
  const [tab_value, set_tab_Value] = useState(0);
  const [chosen_block, set_chosen_block] = useState(user_is_starting ? null : blocs[0])
  const [url,set_url] = useState(null)
  const [reviews, set_reviews] = useState()

  const [demo_checked, set_demo_checked] = useState([])
  const [tags, set_tags] = useState({init:[],new:[],old:[]})
  const [snackBar_content, set_snackBar_content] = useState(null)
  const [chosen_block_reviewed, set_chosen_block_reviewed] = useState(false)

  const [change_menu_anchor,set_change_menu_anchor] = useState(null)
  const [change_menu_open,set_change_menu_open] = useState(false)


  const select_value_init = blocs?.length ? 
    setExChoose(0,"bases")
    :
    <span>Progressing...</span>

  const [select_value, set_select_value] = useState(select_value_init)


  const progress_percent = (row_progress /19) * 100
  const progress_bar_color = ((row_progress /19) * 100) !== 100 ? 'secondary' :'success'

  const {email, status, isManager } = useAuth()

  useEffect(()=>{

    if(!user) return console.log("error no user in tabPanel")

    const blocs = user.Journey_Infos.blocs
    const chosen_block_updated = blocs.find(bloc => bloc._id === chosen_block._id)
    if(!chosen_block_updated) return console.log("error no matching chosen block TabPanel")
    const chosen_block_reviewed = (chosen_block_updated?.hasOwnProperty("reviewed") && chosen_block_updated?.reviewed ) || Boolean(chosen_block_updated?.reviews.length) 
    set_blocs(blocs)
    set_chosen_block(chosen_block_updated)
    set_chosen_block_reviewed(chosen_block_reviewed)

  },[user])

  useEffect(()=>{
    if(!UserReviewsAreSuccess) return
    
    const reviews_init = UserReviews.ids.map(id=>UserReviews.entities[id])
    const search_review = reviews_init?.find((review) => chosen_block.reviews.includes(review._id))
    const chosen_block_reviewed = (chosen_block?.hasOwnProperty("reviewed") && chosen_block?.reviewed ) || Boolean(chosen_block?.reviews?.length) 
    const url = search_review ? search_review.url : null
    const demos_checked = search_review?.demos || []

    set_reviews(reviews_init)
    set_url(url)
    set_chosen_block_reviewed(chosen_block_reviewed)
    pass_bloc_reviewed_to_parent(chosen_block_reviewed)
    set_demo_checked([...demo_checked, ...demos_checked])

  },[UserReviewsAreSuccess, chosen_block])



  useEffect(()=>{

    if(!reviews) return
    const old_tags = user.Student_Perks?.tags || []
    set_tags({new:[], old : old_tags })
    

  },[reviews])


  const handleTabChange = (event, newValue) => {
    set_tab_Value(newValue);
  };

  const handleSelectChange = (value) => {

    const selected_bloc = blocs.filter(bloc => bloc.blocName === value.key)
    if(!selected_bloc?.length){
      return
    }

    set_chosen_block(selected_bloc[0])
    pass_bloc_name_to_parent(selected_bloc[0])
    set_select_value(value.key)


  }

  const handleCheckedDemo = (demos_checked_transmitted) => {
    set_demo_checked(demos_checked_transmitted)
    transmit_demo_to_EditUserInfos(demos_checked_transmitted)    
  }

  const handleChangeClick = (event) => {
    set_change_menu_anchor(event.currentTarget)
    set_change_menu_open(true)
  }

  const handleChangeMenuClose = () => {
    set_change_menu_open(false)
  }


  const seeReview = () => {
    if(!url)return
    window.open(url, "_blank", "noopener,noreferrer");
  }



  const transmitTags = (tags) => {
    set_tags(tags)
    transmit_tags_to_EditUserInfos(tags)
  }

  const ChipTab = styled(Tab)(({ theme }) => ({
    maxWidth: 200,
    minHeight: 32,
    marginTop:5,
    padding: 10,
    borderRadius: 20,
    transition: '0.3s',
    textTransform:'none',
    '&:hover': {
      backgroundColor:  theme.palette.action.hover,
    },
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.mode === 'light' ? 'black' : 'white',
    },
  }));



  const blocs_menu_items = blocs?.length ? blocs.map((bloc,index) => {

    const ex_value = setExChoose(index,bloc.blocName)

    if(chosen_block?.blocName === bloc.blocName) return
    return (

      <MenuItem
        key={bloc.blocName}
        id={bloc.blocName}
        value={ex_value}
      >
        {ex_value}

      </MenuItem>
    )
  }) : []

  const starting_chip = (user_is_starting && <p>Starting...</p>) || null

  const reviewed_chip =   (chosen_block_reviewed && <Chip label={"Reviewed"} clickable={Boolean(url)} onClick={seeReview} sx={{width:100, marginLeft:5}}/>) || null 


  const manager_change_status = 
     change_status_fullfiled ?
    <>
    <Button color='success' onClick={handleChangeClick}>Change</Button>
    <Menu open={change_menu_open} anchorEl={change_menu_anchor} onClose={handleChangeMenuClose}>
      {!chosen_block_reviewed && <MenuItem id='Reviewed' onClick={()=>handleChangeMenuItemClick("Reviewed")}>Reviewed</MenuItem>}
      {chosen_block_reviewed && <MenuItem id='Not Reviewed' onClick={()=>handleChangeMenuItemClick("Not Reviewed")}>Not Reviewed</MenuItem>}

    </Menu>
    </>
    :
    <CircularProgress />


  return (
    <Box>

        {snackBar_content}
        <Box sx={{ width: '100%',marginTop:5 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tab_value} onChange={handleTabChange} aria-label="basic tabs example">
              <ChipTab label="Exercices"   {...a11yProps(0)} />
              <ChipTab label="Messages" sx={{marginLeft:2}} {...a11yProps(1)} />
              <ChipTab label="Tags" sx={{marginLeft:2}} {...a11yProps(2)} />
            </Tabs>
          </Box>
        </Box>

        <div className="table-row-progress-and-value" style={{display:'flex',alignItems:'center',justifyContent:'flex-end',width:'100%',marginRight:150,marginTop:20,marginBottom:20}}> 
          <LinearProgress variant="determinate"  value={progress_percent} color={progress_bar_color} sx={{width:'100%',borderRadius:'5px',height:'6px'}}/> 
          <span style={{fontFamily:'Figtree',marginLeft:'3px'}}>{row_progress}</span>
        </div>

        <Divider/>


        <CustomTabPanel value={tab_value} index={0}>
          <Box sx={{display:'flex', alignItems:'center',maxWidth:'100vw',overflowX:'auto'}}>
            <UserTableFilterButton
              id={"bloc_choose"}
              label={select_value}
              minWidth={100}
              marginLeft={0}  
              onchange={handleSelectChange}
              menu_items={blocs_menu_items}
              title={select_value}
              force_render_value={blocs_menu_items[0]}
              value_init={blocs_menu_items[0]}
              key={"bloc-choose"}
            />

              {starting_chip}
              {reviewed_chip}
              {isManager && manager_change_status}    
          </Box>

        <div style={{margin:20}}></div>

        <Box sx={{display:'flex'}}>
          {chosen_block && <UserInfosTable bloc={chosen_block} handleCheckedDemo={handleCheckedDemo} demos_checked={demo_checked}/>}
        </Box>
        </CustomTabPanel>
        <CustomTabPanel value={tab_value} index={2}>
          <Box sx={{display:'flex', alignItems:'flex-start',maxWidth:'100vw',overflowX:'auto',minHeight:'340px'}}>
            <UserTags transmitTags={transmitTags} tagsTransmitted={tags}/>
          </Box>
        </CustomTabPanel> 


    </Box>
  );
}