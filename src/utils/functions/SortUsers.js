function sortUsers(sort_object ,order ){
    const {to_sort, type, object_value } = sort_object
    
    switch (type) {
        case "alphabetical":

            return (a,b) => {
                    
                    const a_value = accessProperty(a,to_sort)
                    const b_value = accessProperty(b,to_sort)
                    return order 
                    ?
                    a_value.localeCompare(b_value)
                    :
                    b_value.localeCompare(a_value)
                }
            

        case "number":

                return (a,b) => {
                    const a_value = accessProperty(a,to_sort)
                    const b_value = accessProperty(b,to_sort)

                    return order
                    ?
                    a_value - b_value
                    :
                    b_value - a_value
                }

        case "unique":
                if(!object_value) return 0;
                return (a,b) => {

                    const a_value = accessProperty(a,to_sort)
                    const b_value = accessProperty(b,to_sort)

                    return order
                    ?
                     object_value[a_value] - object_value[b_value]
                    :
                     object_value[b_value] - object_value[a_value]
                }
            

        default:
            return 0;

    }
}

function accessProperty(obj, path) {
    return path.split('.').reduce((acc, part) => {
       return acc && acc[part]
    }, obj);
  }
  
module.exports ={ 
    accessProperty,
    sortUsers
}