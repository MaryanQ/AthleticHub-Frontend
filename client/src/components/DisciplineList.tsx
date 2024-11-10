// DisciplineList.tsx
import React, { useEffect, useState } from "react";
import { getAllDisciplines, deleteDiscipline } from "../service/apiFacade";
import { Discipline } from "../type/Discipline";
import { Link, useNavigate } from "react-router-dom";
import "../styles/DisciplineStyles.css"; // Updated to use the correct CSS file

const DisciplineList: React.FC = () => {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadDisciplines();
  }, []);

  const loadDisciplines = async () => {
    try {
      const data = await getAllDisciplines();
      setDisciplines(data);
    } catch (error) {
      console.error("Failed to load disciplines:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDiscipline(id);
      setDisciplines((prev) =>
        prev.filter((discipline) => discipline.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete discipline:", error);
    }
  };

  return (
    <div className="container">
      <h2>Disciplines</h2>
      <ul className="discipline-list">
        {disciplines.map((discipline) => (
          <li key={discipline.id}>
            <span>{discipline.name}</span>
            <div className="discipline-actions">
              <button
                onClick={() => navigate(`/disciplines/edit/${discipline.id}`)}
              >
                Edit
              </button>
              <button onClick={() => handleDelete(discipline.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="button-container">
        <Link to="/disciplines/add">
          <button>Add Discipline</button>
        </Link>
      </div>
    </div>
  );
};

export default DisciplineList;
