import {  useEffect, useState } from "react"
import UserTableFilterButton from "./UserTableFilterButton"
import MenuItem from '@mui/material/MenuItem';
import UserTableFIlterSearchBar from "./UserTableFIlterSearchBar";
import { Avatar } from "@mui/material";
import FaceIcon from '@mui/icons-material/Face';
import { useSelector } from "react-redux";
import { useDashboardContext } from "../../hooks/FiltersContext";

const UserTableFilters = () => {

    const theme = useSelector((state) => state.theme)
    const {rowsLength, handleFilterFunctions, filter_functions} = useDashboardContext()
    let sub_title;
    let status_title
    let bloc_title
    if(filter_functions?.length){
        console.log("filter_func_lenght");
        const sub_func =  filter_functions.filter(obj => obj.type === 'subscriptions')

        const status_func =  filter_functions.filter(obj => obj.type === 'status')
        console.log("status_func:",status_func);
        const bloc_func =  filter_functions.filter(obj => obj.type === 'blocs')
         sub_title = sub_func?.length ? sub_func[0].id : 'Any subscriptions'
         status_title = status_func?.length ? status_func[0].id : 'Any status'
         console.log("status_title:",status_title);
         bloc_title = bloc_func?.length ? bloc_func[0].id : 'Any blocs'
        
    }
    
    const [subscriptions_select,set_subscriptions_select] = useState('')
    const [status_select,set_status_select] = useState('')
    const [bloc_select,set_bloc_select] = useState('')
    

    const onChangeSubscription = (value) => value !== subscriptions_select && set_subscriptions_select(value)
    const onChangeStatus = (value) => value !== status_select && set_status_select(value) 
    const onChangeBloc = (value) => value !== bloc_select && set_bloc_select(value) 

    // useEffect(()=>{
    //     if(!filter_functions?.length) return
    //     if(filter_functions.some(obj => obj.type === "subscriptions")){
    //         filter_functions.filter(obj => obj.type === "subscriptions")
    //     }
    // },[filter_functions])

    useEffect(()=>{
        if(subscriptions_select){
            const filterFunction = (value) => {
                return (e) => e.subscription === value;
            };
    
            handleFilterFunctions({type:'subscriptions',id:subscriptions_select,func:filterFunction(subscriptions_select)})

        }
    },[subscriptions_select])
    
    useEffect(()=>{
        if(status_select){

            const filterFunction = (value) => {
                return (e) => e.status === value;
            };
            handleFilterFunctions({type:'status',id:status_select,func:filterFunction(status_select)})

        }
    },[status_select])

    useEffect(()=>{
        if(bloc_select){
            const filterFunction = (value) => {
                return (e) => e.progress === value;
            };
            handleFilterFunctions({type:'bloc',id:bloc_select,func:filterFunction(bloc_select)})

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
                title={sub_title}
            />
            <UserTableFilterButton
                Label_id={"status-label"}
                id={"status"} 
                label={"Any status"}
                minWidth={150}
                marginLeft={5}
                onchange={onChangeStatus}
                menu_items={statusMenuItems}
                title={status_title}
            />
            <UserTableFilterButton
                Label_id={"blocs-label"}
                id={"blocs"} 
                label={"Any blocs"}
                minWidth={150}
                marginLeft={5}
                onchange={onChangeBloc}
                menu_items={blocMenuItems}
                title={bloc_title}
            />

            <div className="student_number_and_avatar">
                <Avatar   sx={{height:'30px',width:'30px',backgroundColor:'transparent'}}>
                    <FaceIcon  sx={{color:bg_avatar_color}}/>
                </Avatar>
                <span>
                    {rowsLength}  
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
