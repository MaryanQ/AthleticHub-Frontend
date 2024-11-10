// DisciplineDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDisciplineById, deleteDiscipline } from "../service/apiFacade";
import { Discipline } from "../type/Discipline";
import "../styles/AddParticipantForm.css";

const DisciplineDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [discipline, setDiscipline] = useState<Discipline | null>(null);

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

  const handleDelete = async () => {
    if (id) {
      try {
        await deleteDiscipline(Number(id));
        // Redirect back to the list or show a message
      } catch (error) {
        console.error("Failed to delete discipline:", error);
      }
    }
  };

  if (!discipline) return <p>Loading...</p>;

  return (
    <div>
      <h2>{discipline.name}</h2>
      <p>Result Type: {discipline.resultType}</p>
      <button onClick={handleDelete}>Delete</button>
      <Link to={`/disciplines/edit/${id}`}>Edit</Link>
      <Link to="/disciplines">Back to List</Link>
    </div>
  );
};

export default DisciplineDetails;
