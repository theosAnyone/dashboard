import { useState } from "react"
import UserTableFilters from "../features/users/UserTableFilters"
import UsersList from "../features/users/UsersList"
import DashHeader from "./DashHeader"

import { Paper } from "@mui/material"


const DashLayout = () => {
    const [filter_functions, set_filter_functions] = useState([])
    const [rows_lenght,set_rows_lenght] = useState(0)

    const passRowsLength = (value) => {
        set_rows_lenght(value)
    }

    const handleFilterFunctions = (params) => {
        const {type,id,func} = params

        if(id === 'none'){

            const functions_filtered = filter_functions?.filter(e=>{

                return e.type !== type
            })
            set_filter_functions([...functions_filtered])
            return;
        }
        if(filter_functions.some(e => e.id === id)) return

        if(filter_functions.some(e => e.type === type)){
            const functions_filtered = filter_functions.filter(e => e.type !== type)
            set_filter_functions([...functions_filtered,params])
            return
        }
        set_filter_functions([...filter_functions,params])
        return;
    }

    const filter_functions_funcs = filter_functions?.map(obj => obj.func)
    
    const handleClearFilters = () => {
        set_filter_functions(null)
    }

    return (
        <Paper className="dash-container" > 
            <DashHeader/>
            <UserTableFilters handleFilterFunction={handleFilterFunctions} rows_length={rows_lenght} />
            <UsersList filter_functions={filter_functions_funcs} passRowsLength={passRowsLength} handleClearFilters={handleClearFilters}/>
        </Paper>
    )
}
export default DashLayout