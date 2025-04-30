import { useState, useEffect, useRef } from 'react'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import ExerciseItem from "./ExerciseItem.jsx"
import SideBar from "./SideBar.jsx"
import "./component_css/myexercises.css"


export default function MyExercises() {
    const [exercises, setExercises] = useState([])
    const [fetching, setFetching] = useState(true)
    const [editedExercise, setEditedExercise] = useState(null)
    const contentRef = useRef(null)

    const token = useAuthHeader()

    useEffect(() => {
        if (!fetching) return
        fetch(`${import.meta.env.VITE_BACKEND_URL}/exercises`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            },
          }).then(
          response => response.json()
        ).then(
          data => {
            setExercises(data)
            setFetching(false)
          }
        )
      }, [fetching])

    function handleEdit(index) {
      setEditedExercise(exercises[index])
      contentRef.current.classList.add('blurred');
    }

    async function handleEditSubmit() {
      console.log("New edited exercise: ", editedExercise)
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/editExercise`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editedExercise)
      })
      if (response.ok) {
        console.log("Exercise edited successfully")
        setEditedExercise(null)
        contentRef.current.classList.remove("blurred")
      } else {
        console.log("Error editing exercise")
        alert("Error editing exercise")
      }
    }

    async function handleEditDelete() {
      console.log("Deleting exercise: ", editedExercise)
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/deleteExercise`, {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editedExercise)
      })
      if (response.ok) {
        console.log("exercise deleted successfully")
        setEditedExercise(null)
        contentRef.current.classList.remove("blurred")
        window.location.reload()
      } else {
        console.log("Error editing exercise")
        alert("Error editing exercise")
      }
    }

    
    return (
      <>
        <SideBar />
        <div ref={contentRef} className="main-content">
            {!fetching && <h1>My Exercises</h1>}
            {!fetching && <h5>(Click exercise name to view progress)</h5>}
            <div>
                {exercises.map((exerciseData, index) => (
                    <ExerciseItem key={index} exercise={exerciseData} handleEdit={handleEdit} index={index}/>
                ))}
            </div>
        </div>
        {editedExercise ? (
          <div className="popup-form">
            <label>Edit name: </label>
            <input
              type="text"
              placeholder={editedExercise.name}
              onChange={(e) => {
                let updatedExercise = editedExercise
                updatedExercise.name = e.target.value
                setEditedExercise(updatedExercise)
              }}
            />
            <div className="buttons-container">
            {![2,3,4].includes(editedExercise.id) && <button className="delete-button" onClick={handleEditDelete}>Delete Exercise</button>}
              <div className="right-buttons-container">
                <button 
                  onClick={() => {
                  setEditedExercise(null)
                  contentRef.current.classList.remove("blurred")}
                  }>Cancel</button>
                <button className="submit-button" onClick={handleEditSubmit}>Submit</button>
              </div>
            </div>
          </div>
          ) : null}
      </>
    )
}