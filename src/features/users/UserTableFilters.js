import {  useEffect, useState } from "react"
import UserTableFilterButton from "./UserTableFilterButton"
import MenuItem from '@mui/material/MenuItem';
import UserTableFIlterSearchBar from "./UserTableFIlterSearchBar";
import { Avatar } from "@mui/material";
import FaceIcon from '@mui/icons-material/Face';
import { useSelector } from "react-redux";

const UserTableFilters = ({handleFilterFunction,rows_length}) => {

    const theme = useSelector((state) => state.theme)

    const [subscriptions_select,set_subscriptions_select] = useState('')
    const [status_select,set_status_select] = useState('')
    const [bloc_select,set_bloc_select] = useState('')
    

    const onChangeSubscription = (value) => value !== subscriptions_select && set_subscriptions_select(value)
    const onChangeStatus = (value) => value !== status_select && set_status_select(value) 
    const onChangeBloc = (value) => value !== bloc_select && set_bloc_select(value) 

    useEffect(()=>{
        if(subscriptions_select){
            const filterFunction = (value) => {
                return (e) => e.subscription === value;
            };
    
            handleFilterFunction({type:'subscriptions',id:subscriptions_select,func:filterFunction(subscriptions_select)})

        }
    },[subscriptions_select])
    
    useEffect(()=>{
        if(status_select){
            const filterFunction = (value) => {
                return (e) => e.status === value;
            };
            handleFilterFunction({type:'status',id:status_select,func:filterFunction(status_select)})

        }
    },[status_select])

    useEffect(()=>{
        if(bloc_select){
            const filterFunction = (value) => {
                return (e) => e.progress === value;
            };
            handleFilterFunction({type:'bloc',id:bloc_select,func:filterFunction(bloc_select)})

        }
    },[bloc_select])

    const handleClearFilter = () => {
        set_bloc_select(null)
        set_status_select(null)
        set_subscriptions_select(null)
    }

    const subscriptionsMenuItems = [
        <MenuItem key={"empty"} value={""} sx={{height:30}}>none</MenuItem>,
        <MenuItem key={"Pro"} value={"Pro"}>Pro</MenuItem>,
        <MenuItem key={"Carriere"} value={"Carriere"}>Carriere</MenuItem>,
        <MenuItem key={"Demo"} value={"Demo"}>Demo</MenuItem>
    ]
    const statusMenuItems = [
        <MenuItem key={"empty"} value={""} sx={{height:30}}>none</MenuItem>,
        <MenuItem key={"Not reviewed"} value={"Not reviewed"}>Not reviewed</MenuItem>,
        <MenuItem key={"Reviewed"} value={"Reviewed"}>Reviewed</MenuItem>,
        <MenuItem key={"In progress"} value={"In progress"}>In progress</MenuItem>,
        <MenuItem key={"Finished"} value={"Finished"}>Finished</MenuItem>,
        <MenuItem key={"Just started"} value={"Just started"}>Just started</MenuItem>,
    ]
    const blocMenuItems = Array.from({ length: 19 }, (_, i) => (
        <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>))
    blocMenuItems.unshift(<MenuItem key={"empty"} value={""} sx={{height:30,color:'grey'}}>none</MenuItem>)
    
    const bg_avatar_color = theme === 'light' ? '#000000' : '#ffffff'


 return ( 
    <div className="user-table-filters-container">
        <h1 style={{marginLeft:'5px',fontSize:40,marginTop:0}}>Students</h1>
        <div className="user-table-filters-div">
            <div className="filters-buttons">
            <UserTableFilterButton
                Label_id={"subscriptions-label"}
                id={"subscriptions"} 
                label={"Any subscriptions"}
                minWidth={200}
                marginLeft={0}
                onchange={onChangeSubscription}
                menu_items={subscriptionsMenuItems}
                title={"Any subscriptions"}
            />
            <UserTableFilterButton
                Label_id={"status-label"}
                id={"status"} 
                label={"Any status"}
                minWidth={150}
                marginLeft={5}
                onchange={onChangeStatus}
                menu_items={statusMenuItems}
                title={"Any status"}
            />
            <UserTableFilterButton
                Label_id={"blocs-label"}
                id={"blocs"} 
                label={"Any blocs"}
                minWidth={150}
                marginLeft={5}
                onchange={onChangeBloc}
                menu_items={blocMenuItems}
                title={"Any blocs"}
            />

            <div className="student_number_and_avatar">
                <Avatar   sx={{height:'30px',width:'30px',backgroundColor:'transparent'}}>
                    <FaceIcon  sx={{color:bg_avatar_color}}/>
                </Avatar>
                <span>
                    {rows_length}  
                </span>

            </div>

            </div>

            <div className="filters-search-bar-avatar">
                <Avatar   sx={{height:'30px',width:'30px',backgroundColor:'transparent'}}>
                    <FaceIcon  sx={{color:bg_avatar_color, fontSize:40}}/>
                </Avatar>
                <UserTableFIlterSearchBar  />
            </div>
        </div>
    </div>
 )
}

export default UserTableFilters
