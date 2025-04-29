import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import useSignIn from 'react-auth-kit/hooks/useSignIn'

export default function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const signIn = useSignIn()

    async function handleLoginSubmit() {
        if (username == "" || password == "") {
            alert("Input username and password before submitting")
        } else {
            const userData = {
                username: username,
                password: password
            }
            console.log("logging env var: ", import.meta.env.VITE_BACKEND_URL);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, { // ensure the /login route exists in the server
                method: 'POST',
                credentials: "include",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userData)
            })
            if (response.ok) {
                const data = await response.json()
                const isSignedIn = signIn({
                    auth: {
                      token: data.token,
                      type: 'token'
                    },
                    userState: { username: username, userId: data.user.id }
                  });
                navigate("/Dashboard")
            } else {
                console.error("Error logging in: ", await response.json())
                return         
            }
        }
    }


    return (
        <> 
            <h1>Log In</h1>
            <div>
                <input 
                    type="text" 
                    placeholder="username" 
                    id="username"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="password" 
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={() => handleLoginSubmit()}>Submit</button>
            </div>
        </>
    )
}