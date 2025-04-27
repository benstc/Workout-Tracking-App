export default function WorkoutItem({ date, notes, id, handleClick}) {
    
    const new_date = date.split("T")[0]

    return (
        <div onClick={() => handleClick(id)} className="workout-item">
            <h5>Date: {new_date}</h5>
            <h5>Notes: {notes}</h5>
        </div>
    )
}