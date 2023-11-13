import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isManager = false;
    let isAdmin = false
    let status = "Teacher"

    if(token){
        const decoded = jwtDecode(token)
        console.log("decoded:",decoded);
        const {email, roles} = decoded.TeacherInfo

        isManager = roles.includes("Manager")
        isAdmin = roles.includes("Admin")

        if (isManager) status = "Manager"
        if (isAdmin) status = "Admin"

        return {email, roles, status, isManager, isAdmin}

    }

    return {email:'', roles:[], isManager, isAdmin, status}
}
export default useAuth