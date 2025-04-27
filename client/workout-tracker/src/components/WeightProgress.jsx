import { useState, useEffect } from 'react'
import Graph from './Graph.jsx'
import SideBar from './SideBar.jsx'
import './component_css/myexercises.css'

/* ^^^ Change ExerciseGraph to be called Graph.jsx or something more general
 and change ExerciseGraph to have the label given as params since thats
 the only difference between what this weight progress graph will be and 
 the exercise details graph */

export default function WeightProgress() {
    const [fetching, setFetching] = useState(true)
    const [graphData, setGraphData] = useState(null)
    
    useEffect(() => {
        if (!fetching) return
        fetch("http://localhost:4800/weightData", {
            method: "GET",
            credentials: "include"
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