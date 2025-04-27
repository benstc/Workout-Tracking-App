import { useState } from 'react'
import { useNavigate } from "react-router-dom"

export default function HomePage() {
    const navigate = useNavigate()

    return (
        <div>
            <h1>Welcome!</h1>
            <div>
                <button onClick={() => navigate("/login")}>Log in</button>
                <button onClick={() => navigate("/signup")}>Sign Up</button>
            </div>
        </div>
    )
}