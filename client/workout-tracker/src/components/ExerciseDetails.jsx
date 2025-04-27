import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Graph from './Graph.jsx'
import SideBar from './SideBar.jsx'
import './component_css/myexercises.css'

export default function ExerciseDetails() {
    const { exerciseId } = useParams()
    const [fetching, setFetching] = useState(true)
    const [exerciseData, setExerciseData] = useState(null)
    const [exerciseName, setExerciseName] = useState()

    useEffect(() => {
        if (!fetching) return
        fetch(`http://localhost:4800/exerciseData/${exerciseId}`, {
            method: "GET",
            credentials: "include",
          }).then(
          response => response.json()
        ).then(
          data => {
            setExerciseName(data.exercise)
            handleData(data.sets)
            setFetching(false)
          }
        )
      }, [fetching])

    function handleData(data) {
        let tempExData = [] // each element in array will be an obj containing sets and weight array and a date value
        for(let i=0; i < data.length; i++) {
            const strippedDate = data[i].date.split("T")[0]
            const lastEntry = tempExData.length > 0 ? tempExData[tempExData.length - 1] : null
            if (!lastEntry || lastEntry.date != strippedDate) {
                tempExData.push({
                    reps: [data[i].reps],
                    weight: [data[i].weight],
                    date: strippedDate
                })
            } else {
                lastEntry.reps.push(data[i].reps)
                lastEntry.weight.push(data[i].weight)
            }
        }
        var volumeGraphData = {
            x: [],
            y: [],
            label: 'Total Volume (lbs)'
        }
        tempExData.forEach((item, index) => {
            let totalVolume = 0
            for (let i=0; i<item.reps.length; i++) {
                totalVolume += item.reps[i]*item.weight[i]
            }
            volumeGraphData.x.push(item.date)
            volumeGraphData.y.push(totalVolume)
        })
        setExerciseData(volumeGraphData)
    }


    return (
        <>
            <SideBar />
            <div className='graph-details-container'>
                <h1>{exerciseName}</h1>
                {exerciseData && <Graph data={exerciseData} />}
            </div>      
        </>
    )
}