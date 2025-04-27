import SetLog from "./SetLog"
import { useState } from "react"

export default function ExerciseLog({ index, exerciseObj, onExerciseChange, onExerciseDelete }) {
    const [sets, setSets] = useState([])

    function addSet() {
        const newSet = { weight: "", reps: ""}
        const updatedSets = [...sets, newSet]
        setSets(updatedSets);
        onExerciseChange(exerciseObj.exercise.id, updatedSets)
    }

    function handleSetChange(index, field, value) {
        var updatedSets = [...sets]
        updatedSets[index] = { ...updatedSets[index], [field]: value }
        setSets(updatedSets)
        onExerciseChange(exerciseObj.exercise.id, updatedSets)
    }

    function handleSetDelete(targetIndex) {
        const newSets = sets.filter((log, index) => index !== targetIndex);
        setSets(newSets)
    }

    return (
        <div className="exercise-log-component" >
            <div className="new-exercise-and-back-container">
                <button className="back-button" onClick={() => onExerciseDelete(index)}>X</button>
            </div>
            <h2>{exerciseObj.exercise.name}</h2>
            {sets.length != 0 ? sets.map((set, index) => (
                <SetLog key={index} setInfo={set} index={index} onSetChange={handleSetChange} onSetDelete={handleSetDelete} />
            )) : null}
            <div>
                <button onClick={addSet}>Add Set</button>
            </div>
        </div>
    )
}