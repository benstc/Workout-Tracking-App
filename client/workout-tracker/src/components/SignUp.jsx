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
            const userData = {
                username: username,
                password: password
            }
            const data = await trySignUp(userData)
            if (data == -1) {
                alert("Error logging in, return to landing page and try again")
            } else {
                const isSignedIn = signIn({
                    auth: {
                        token: data.token,
                        type: 'token'
                    },
                    userState: { username: username, userId: data.user.id }
                });
                navigate("/Dashboard")         
            }
        }
    }

    async function trySignUp(userData, retries = 1) {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sign-up`, { //ensure that the /signup path exists in server
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userData)
            })
            if (!response.ok) {
                throw new Error(errorData.message || 'Login failed');
            }
            return await response.json();
        } catch (err) {
          if (retries > 0) {
            console.warn("Login failed — retrying in 1s...");
            await new Promise(res => setTimeout(res, 1000));
            return trySignUp(userData, retries - 1);
          } else {
            return -1;
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