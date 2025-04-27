import { useState } from 'react'
import Select from 'react-select'

export default function SearchableSelect({ callback, exerciseOptions }) {
    const [selectedOption, setSelectedOption] = useState(null)

    function handleChange(selected) {
        const formatedSelect = {
            name: selected.label,
            id: selected.value
        }
        setSelectedOption(formatedSelect)
    }

    function handleSubmit() {
        if (!selectedOption) {
            alert("You must select an option before submitting or add a new exercise")
        } else {
            const new_exercise = {
                exercise: selectedOption,
                sets: []
            }
            callback(new_exercise)
        }
    }


    const options = exerciseOptions.map((exercise) => (
        { value: exercise.id, label: exercise.name }
    ))

    const customStyles = {
        control: (provided) => ({
          ...provided,
          backgroundColor: "#282c34", // Custom background color
          borderRadius: "8px", // Rounded corners
          padding: "5px",
          border: "1px solid #61dafb",
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? "#61dafb" : "white",
          color: state.isSelected ? "black" : "black",
          padding: "10px",
          "&:hover": {
            backgroundColor: "#b3e5fc", // Hover color
          },
        }),
        placeholder: (provided) => ({
          ...provided,
          color: "#bbb", // Placeholder color
        }),
        singleValue: (provided) => ({
          ...provided,
          color: "#61dafb", // Selected value color
        }),
        input: (provided) => ({
            ...provided,
            color: "white",
        }),
      };

    return (
            <div className="search-container">
                <Select 
                className="search-select"
                options={options}
                styles={customStyles}
                isSearchable
                onChange={handleChange}
                />
                <button 
                className="search-submit"
                onClick={handleSubmit}>Submit</button>
            </div>
    )
}