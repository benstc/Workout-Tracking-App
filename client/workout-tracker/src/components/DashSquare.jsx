import "./component_css/dashsquare.css"
import { useNavigate } from "react-router-dom"

export default function DashSquare({ name, imgPath, redirectPath }) {
    const navigate = useNavigate()

    return (
        <div className="dash-square" onClick={() => navigate(redirectPath)}>
            <h3>{name}</h3>
            <img src={imgPath} width="100" height="100"></img>
        </div>
    )
}