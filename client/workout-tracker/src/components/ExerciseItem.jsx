import { Link } from 'react-router-dom'

export default function ExerciseItem({ exercise, handleEdit, index }) {

    return (
        <div className="exercise-item">
            <Link to={`/exercises/${exercise.id}`}>{exercise.name}</Link>
            <img onClick={() => handleEdit(index)} src="/src/assets/icons/edit2.png" width="20" height="20"/>
        </div>
    )
}