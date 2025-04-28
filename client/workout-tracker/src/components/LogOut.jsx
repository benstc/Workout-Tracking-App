import { useNavigate } from "react-router-dom"
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import "./component_css/logoutButton.css"

//
export default function LogOut() {
    const navigate = useNavigate()
    const signOut = useSignOut()

    async function handleLogOut() {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
                method: 'POST',
                credentials: "include",
                headers: {'Content-Type': 'application/json'}
            })
            if (response.ok) { 
                signOut()
                navigate("/")
            } else {
                console.log("Error logging out")
            }
    }

    return (
        <button className="logoutButton" onClick={() => handleLogOut()}>Sign Out</button>
    )
}