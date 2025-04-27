export default function SetLog({ setInfo, index, onSetChange, onSetDelete }) {

    return (
        <div>
            <input
                type="number"
                placeholder="Weight"
                value={setInfo.weight}
                onChange={(e) => onSetChange(index, "weight", e.target.value)}
            />
            <input
                type="number"
                placeholder="Reps"
                value={setInfo.reps}
                onChange={(e) => onSetChange(index, "reps", e.target.value)}
            />
            <button className="delete-log-button" onClick={() => onSetDelete(index)}>Delete</button>
        </div>
    )
}