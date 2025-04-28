import { useState } from "react"
import SideBar from "./SideBar"
import { useNavigate } from "react-router-dom"
import "./component_css/weightlog.css"

export default function WeightLog() {
    const [weightInput, setWeightInput] = useState("")
    const [dateInput, setDateInput] = useState("")
    const navigate = useNavigate()
    
    async function submitWeightLog() {
        if (!dateInput || !weightInput) {
            alert("Input weight and date before submitting")
            return
        } else {
            const data = {
                weight: weightInput,
                date: dateInput
            }
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/submitWeightLog`, {
                method: 'POST',
                credentials: "include",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            if (response.ok) {
                console.log("Weight log submitted successfully")
                navigate("/Dashboard")
            } else {
                console.log("Error submitting weight log")
                alert("Error submitting weight log")
            }

        }
    }

    return (
        <div>
            <SideBar />
            <div className="weight-log-container">
                <h1>Track Weight</h1>
                <div className="weight-input-container">
                    <label>{"Weight (lbs): "}</label>
                    <input
                        type="number" 
                        value={weightInput} 
                        onChange={(e) => setWeightInput(e.target.value)} 
                    />
                </div>
                <div className="date-input-container">
                    <label>Date: </label>
                    <input
                        type="date"
                        value={dateInput}
                        onChange={(e) => setDateInput(e.target.value)}
                    />
                </div>
                <div>
                    <button onClick={submitWeightLog}>Submit</button>
                </div>
            </div>
        </div>
    )
}