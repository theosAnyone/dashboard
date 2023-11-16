
import UserTableFilters from "../features/users/UserTableFilters"
import UsersList from "../features/users/UsersList"
import DashHeader from "./DashHeader"


import { Paper } from "@mui/material"


const DashLayout = () => {
    

    return (
        
        <Paper className="dash-container" > 
            
                <DashHeader/>
                <UserTableFilters />
                <UsersList />

        </Paper>
    )
}
export default DashLayout