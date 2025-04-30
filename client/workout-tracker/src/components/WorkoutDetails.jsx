import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import SideBar from "./SideBar.jsx"
import WorkoutExercise from "./WorkoutExercise.jsx"
import "./component_css/workoutdetails.css"

export default function WorkoutDetails() {
    const { workoutId } = useParams()
    const [fetching, setFetching] = useState(true)
    const [workoutData, setWorkoutData] = useState(null)
    const navigate = useNavigate()
    const token = useAuthHeader()


    
    useEffect(() => {
        if (!fetching) return
        fetch(`${import.meta.env.VITE_BACKEND_URL}/workoutData/${workoutId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            },
          }).then(
          response => {
            if (response.status === 200) {
                return response.json()
            } else {
                navigate("/workoutHistory")
            }
          }
        ).then(
          data => {
            handleWorkoutData(data)
            setFetching(false)
          }
        )
      }, [fetching])

    function handleWorkoutData(data) {
        let exerciseArray = []
        const sets = data.sets
        for (let i=0; i<sets.length; i++) {
            const lastEntry = exerciseArray.length > 0 ? exerciseArray[exerciseArray.length - 1] : null
            if (!lastEntry || lastEntry.name != sets[i].name) {
                exerciseArray.push({
                    name: sets[i].name,
                    sets: [{
                        reps: sets[i].reps,
                        weight: sets[i].weight
                    }]
                })
            } else {
                const newSet = {
                    reps: sets[i].reps,
                    weight: sets[i].weight
                }
                lastEntry.sets.push(newSet)
            }
        }
        const newData = {
            date: data.date.split("T")[0],
            notes: data.notes,
            exercises: exerciseArray
        }
        console.log("workout data: ", newData)
        setWorkoutData(newData)
    }

    return (
        <>
            <SideBar />
            {workoutData && <h1>Date: {workoutData.date}</h1>}
            {workoutData && <h2>Notes: {workoutData.notes}</h2>}
            <div className="workout-data-container">
                {workoutData ? workoutData.exercises.map((exercise, index) => (
                    <WorkoutExercise key={index} exercise={exercise} />
                )) : null}
            </div>
        </>
    )
}