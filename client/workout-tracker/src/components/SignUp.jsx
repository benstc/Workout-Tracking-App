import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import useSignIn from 'react-auth-kit/hooks/useSignIn'

export default function SignUp() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const signIn = useSignIn()

    async function handleSignInSubmit() {
        if (username == "" || password == "") {
            alert("Input username and password before submitting")
        } else {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sign-up`, { //ensure that the /signup path exists in server
                method: 'POST',
                credentials: "include",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: username,
                    password: password
                })
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
                console.error("Error signing up: ", await response.json())
                return                
            }
        }
    }

    return (
        <>
            <h1>Sign Up</h1>
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
                <button onClick={() => handleSignInSubmit()}>Submit</button>
            </div>
        </>
    )
}