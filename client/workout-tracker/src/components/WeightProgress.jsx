import { useState, useEffect } from 'react'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import Graph from './Graph.jsx'
import SideBar from './SideBar.jsx'
import './component_css/myexercises.css'

export default function WeightProgress() {
    const [fetching, setFetching] = useState(true)
    const [graphData, setGraphData] = useState(null)
    const token = useAuthHeader()
    
    useEffect(() => {
        if (!fetching) return
        fetch(`${import.meta.env.VITE_BACKEND_URL}/weightData`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            },
        }).then(
            response => response.json()
        ).then(
            data => {
                handleData(data)
                setFetching(false)
            }
        )
    }, [fetching])

    function handleData(data) {
        var tempData = {
            x: [],
            y: [],
            label: "Bodyweight (lbs)"
        }
        for (let i = 0; i < data.length; i++) {
            const parsedDate = data[i].date.split("T")[0]
            tempData.x.push(parsedDate)
            tempData.y.push(data[i].weight)
        }
        setGraphData(tempData)
    }

    return (
        <>
            <SideBar />
            <div className='graph-details-container'>
                {graphData && <h1>Bodyweight</h1>}
                {graphData && <Graph data={graphData} />}
            </div>
        </>
    )
}