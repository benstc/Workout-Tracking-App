import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import WorkoutItem from "./WorkoutItem.jsx"
import SideBar from "./SideBar.jsx"
import "./component_css/workouthistory.css"

export default function WorkoutHistory() {
    const [fetching, setFetching] = useState(true)
    const [workouts, setWorkouts] = useState(null)
    const navigate = useNavigate()
    const token = useAuthHeader()


    useEffect(() => {
        if (!fetching) return
        fetch(`${import.meta.env.VITE_BACKEND_URL}/workouts`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            },
          }).then(
          response => response.json()
        ).then(
          data => {
            setWorkouts(data)
            setFetching(false)
          }
        )
      }, [fetching])
    
    function handleItemClick(id) {
        console.log("Clicked exercise with id: ", id)
        navigate(`/workouts/${id}`)
    }

    return (
        <>
            <SideBar />
            {workouts && <h1>Workout History</h1>}
            {workouts && <h4>(Click items for more details)</h4>}
            <div className="workout-items-container">
                {workouts ? workouts.map((workout, index) => (
                    <WorkoutItem key={workout.id} date={workout.date} notes={workout.notes} id={workout.id} handleClick={handleItemClick}/>
                )) : null}
            </div>    
        </>
    )
}