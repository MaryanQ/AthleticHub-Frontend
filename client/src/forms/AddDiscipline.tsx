// AddDiscipline.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDiscipline } from "../service/apiFacade";
import { Discipline } from "../type/Discipline";
import { ResultType } from "../type/enums";
import "../styles/AddParticipantForm.css";

const AddDiscipline: React.FC = () => {
  const [discipline, setDiscipline] = useState<Discipline>({
    id: 0,
    name: "",
    resultType: ResultType.DISTANCE,
    results: [],
  });
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDiscipline({ ...discipline, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDiscipline(discipline);
      navigate("/disciplines");
    } catch (error) {
      console.error("Failed to add discipline:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Discipline</h2>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={discipline.name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Result Type:
        <select
          name="resultType"
          value={discipline.resultType}
          onChange={handleChange}
        >
          <option value="DISTANCE">Distance</option>
          <option value="TIME">Time</option>
        </select>
      </label>
      <button type="submit">Add Discipline</button>
    </form>
  );
};

export default AddDiscipline;
