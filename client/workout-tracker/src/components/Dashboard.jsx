import SideBar from "./SideBar.jsx"
import DashSquare from "./DashSquare.jsx"
import LogOut from "./LogOut.jsx"
import "./component_css/dashboard.css"

export default function Dashboard() {

    return (
        <>
            <SideBar />
            <LogOut />
            <div className="square-container">
                <DashSquare name="Log Workout" imgPath="/src/assets/icons/dumbbell.png" redirectPath="/logWorkout"/>
                <DashSquare name="Log Weight" imgPath="/src/assets/icons/scale.png" redirectPath="/logWeight"/>
            </div>
        </>
    )
}