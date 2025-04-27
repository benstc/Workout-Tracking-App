import { useState, useEffect, useRef } from 'react'
import ExerciseLog from "./ExerciseLog.jsx"
import SearchableSelect from './SearchableSelect.jsx'
import SideBar from './SideBar.jsx'
import { useNavigate } from "react-router-dom"

export default function WorkoutLog() {
    /* exercises is an array of tuples that contain string name of the
    exercise along with its database id */
    const [exercises, setExercises] = useState([]);
    const [workoutDate, setWorkoutDate] = useState("")
    const [workoutNotes, setWorkoutNotes] = useState("")
    const [isAddingExercise, setIsAddingExercise] = useState(false)
    const [exerciseOptions, setExerciseOptions] = useState(null)
    const [fetching, setFetching] = useState(true)
    const [addingNewExercise, setAddingNewExercise] = useState(false)
    const navigate = useNavigate()
    const newInputRef = useRef(null)

    useEffect(() => {
        if (!fetching) return
        fetch('http://localhost:4800/exercises', {
            method: "GET",
            credentials: "include",
          }).then(
          response => response.json()
        ).then(
          data => {
            setExerciseOptions(data)
            setFetching(false)
          }
        )
      }, [fetching])

    function handleExerciseChange(exerciseId, sets) {
        const newExercises = exercises.map((exerciseObj) => (
            exerciseObj.exercise.id === exerciseId ? { 
                exercise: exerciseObj.exercise, 
                sets: sets
            } : exerciseObj
        ))
        setExercises(newExercises);
    }

    function handleNewExerciseLog(exercise) {
        console.log(exercise)
        var new_exercises = exercises.slice()
        new_exercises.push(exercise)
        setIsAddingExercise(false)
        setExercises(new_exercises)
    }

    function handleExerciseDelete(targetIndex) {
        const newExercises = exercises.filter((exercise, index) => index !== targetIndex);
        setExercises(newExercises)
    }
    
    async function handleNewExerciseInput() {
        const name = newInputRef.current.value
        if (name === "") {
            alert("Type an exercise before submitting")
        } else {
            const response = await fetch('http://localhost:4800/newExercise', {
                method: 'POST',
                credentials: "include",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({exerciseName: name})
            });
    
            if (!response.ok) {
                console.error("Error:", await response.json());
                return;
            }
    
            const exercise = await response.json()
            const new_exercise = {
                exercise: exercise,
                sets: []
            }
            setAddingNewExercise(false)
            handleNewExerciseLog(new_exercise)
            setFetching(true)
        }
    }

    async function submitWorkout() {
        // check if any of the values are left blank
        for (var i=0; i < exercises.length; i++) {
            const exerciseObj = exercises[i]
            const sets = exerciseObj.sets
            for (var j=0; j < sets.length; j++) {
                const set = sets[j]
                if (set.weight == "" || set.reps == "") {
                    alert("Input values to all sets before submitting")
                    return
                }
            }
        }

        if (!workoutDate) {
            alert("Please select a date for your workout.");
            return;
        }

        const workoutData = {
            exercises: exercises,
            date: workoutDate,
            notes: workoutNotes
        }
        const response = await fetch('http://localhost:4800/submitWorkout', {
                method: 'POST',
                credentials: "include",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(workoutData)
            });
        if (response.ok) {
            console.log("Workout submitted successfully")
            // have it reroute to the homepage for now since I haven't made
            // the dashboard yet
            navigate("/Dashboard")
        } else {
            console.log("Error submitting workout")
            alert("Error submitting workout")
        }
    }

    return (
        <>
            <SideBar />
            <h1>Track Workout</h1>
            {exercises.length === 0 ? null 
            : exercises.map((exercise, index) => (
                <ExerciseLog key={index} index={index} exerciseObj={exercise} onExerciseChange={handleExerciseChange} onExerciseDelete={handleExerciseDelete}/>
            ))}
            {isAddingExercise && !addingNewExercise ? (
                    <div className="exercise-input-container">
                        <div className="new-exercise-and-back-container">
                            <button className="back-button" onClick={() => setIsAddingExercise(false)}>X</button>
                            <p className="new-exercise" onClick={() => setAddingNewExercise(true)}>Add New Exercise</p>
                        </div>
                        <h3>Select Exercise</h3>
                        <SearchableSelect callback={handleNewExerciseLog} exerciseOptions={exerciseOptions} />
                    </div>
            ) : isAddingExercise && addingNewExercise ? (
                <div className="exercise-input-container">
                    <div className="new-exercise-and-back-container">
                        <button className="back-button" onClick={() => setAddingNewExercise(false)}>X</button>
                    </div>
                    <h3>Add New Exercise</h3>
                    <input ref={newInputRef} className="custom-exercise-input" type="text" id="newExercise" placeholder="Enter new exercise" />
                    <button className="new-exercise-submit-button" onClick={handleNewExerciseInput}>Submit</button>
                </div>
            ) : null}
            {!isAddingExercise ? <button onClick={() => setIsAddingExercise(true)}>Click to add new exercise</button> : null}
            <div className="workout-date-container">
                <label>Workout Date:</label>
                <input 
                    type="date" 
                    value={workoutDate} 
                    onChange={(e) => setWorkoutDate(e.target.value)} 
                />
            </div>

            <div className="workout-notes-container">
                <label>Workout Notes:</label>
                <textarea 
                    value={workoutNotes} 
                    onChange={(e) => setWorkoutNotes(e.target.value)} 
                    placeholder="Any notes about this workout?"
                />
            </div>
            {exercises.length != 0 ? <div>
                <button onClick={submitWorkout}>Submit</button>
            </div> : null}
        </>
    )
}