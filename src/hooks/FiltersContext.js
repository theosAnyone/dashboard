import React, { createContext, useState, useContext, useEffect } from 'react';

const DashboardContext = createContext();

export const useDashboardContext = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
    const default_filter = [
        {
            type:"subscriptions",
            id:"Pro",
            func:(e)=>e.subscription === 'Pro'
        },
        {
            type:"status",
            id:"Not Reviewed",
            func:(e)=>e.status === 'Not reviewed'
        }
    ]
    const [rowsLength, setRowsLength] = useState(1000);
    const [filter_functions, set_filter_functions] = useState(default_filter)
    const [filter_functions_funcs, setfilter_functions_funcs] = useState(default_filter.map(obj=>obj.func))
    

    useEffect(() => {

        console.log("filter_functions changed:", filter_functions);

        const filter_functions_funcs_mapped = filter_functions?.map(obj => obj.func)

        setfilter_functions_funcs(filter_functions_funcs_mapped)

    }, [filter_functions]);



    const handleFilterFunctions = (params) => {



        const {type,id} = params

        if(id === 'none'){

            const functions_filtered = filter_functions?.filter(e=>{

                return e.type !== type
            })
            set_filter_functions([...functions_filtered])
            return;
        }

        if(filter_functions.some(e => e.id === id)){
            return
        } 

        if(filter_functions.some(e => e.type === type)){
            const functions_filtered = filter_functions.filter(e => e.type !== type)
            set_filter_functions([...functions_filtered,params])
            return
        }
        console.log("filterfunction:",[...filter_functions,params]);
        set_filter_functions([...filter_functions,params])


    }


    const handleClearFilters = () => {
        console.log("filter_functions CLEARED");
        set_filter_functions([])
    }
    // Toute autre logique nécessaire

    return (
        <DashboardContext.Provider value={{handleFilterFunctions, filter_functions_funcs, filter_functions,  rowsLength, setRowsLength, handleClearFilters }}>
            {children}
        </DashboardContext.Provider>
    );
};







