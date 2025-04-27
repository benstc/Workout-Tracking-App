

export default function WorkoutExercise({ exercise }) {
    return (
        <div>
            <h4>{exercise.name}</h4>
            <div>
            {exercise.sets.map((set, index) => (
                <div key={index} className="set-container">
                    <p>set #{index+1}</p>
                    <p>reps: {set.reps}</p>
                    <p>weight: {set.weight}</p>
                </div>
            ))}
            </div>
        </div>
    )
}