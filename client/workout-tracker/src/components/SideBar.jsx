import "./component_css/sidebar.css"
import { useNavigate } from "react-router-dom"

export default function SideBar() {
    const navigate = useNavigate()
    return (
        <div className="sidebar">
            <div onClick={() => navigate("/Dashboard")}>Dashboard</div>
            <div onClick={() => navigate('/myExercises')}>My Exercises</div>
            <div onClick={() => navigate('/workoutHistory')}>Workout History</div>
            <div onClick={() => navigate('/weightProgress')}>Bodyweight Progress</div>
        </div>
    )
}