// EditDiscipline.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDisciplineById, updateDiscipline } from "../service/apiFacade";
import { Discipline } from "../type/Discipline";
import "../styles/AddParticipantForm.css";

const EditDiscipline: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [discipline, setDiscipline] = useState<Discipline | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscipline = async () => {
      if (id) {
        try {
          const data = await getDisciplineById(Number(id));
          setDiscipline(data);
        } catch (error) {
          console.error("Failed to fetch discipline:", error);
        }
      }
    };
    fetchDiscipline();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (discipline) {
      setDiscipline({ ...discipline, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (discipline) {
      try {
        await updateDiscipline(Number(id), discipline);
        navigate("/disciplines");
      } catch (error) {
        console.error("Failed to update discipline:", error);
      }
    }
  };

  if (!discipline) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Discipline</h2>
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
      <button type="submit">Update Discipline</button>
    </form>
  );
};

export default EditDiscipline;
