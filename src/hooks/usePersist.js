import {useState, useEffect} from "react"


const usePersist = () => {
    const [persist, set_persist] = useState(JSON.parse(localStorage.getItem("persist")) || false);

    useEffect(()=>{
        localStorage.setItem("persist",JSON.stringify(persist))
    },[persist])

    return [persist, set_persist]
}

export default usePersist