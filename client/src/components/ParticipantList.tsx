import React, { useEffect, useState } from "react";
import { Participant } from "../type/Participant";
import {
  getAllParticipants,
  deleteParticipant,
  searchParticipantsByName,
} from "../service/apiFacade";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ParticipantList.css";

const ParticipantList: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch participants on component mount
  const fetchParticipants = async () => {
    try {
      const data = await getAllParticipants();
      setParticipants(data);
    } catch (err) {
      console.error("Error fetching participants:", err);
      setError("Failed to fetch participants.");
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      await deleteParticipant(id);
      setParticipants((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting participant:", err);
      setError("Failed to delete participant.");
    }
  };

  // Handle edit navigation
  const handleEdit = (id: number) => {
    navigate(`/edit-participant/${id}`);
  };

  const handleAdd = () => {
    navigate("/participants/new"); // Navigate to add participant form
  };

  const handleSearch = async () => {
    if (searchTerm) {
      try {
        const data = await searchParticipantsByName(searchTerm);
        setParticipants(data);
      } catch (err) {
        console.error("Error searching participants:", err);
        setError("Failed to search participants.");
      }
    } else {
      fetchParticipants();
    }
  };

  return (
    <div className="participant-list">
      <h2>Participants</h2>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleAdd}>Add Participant</button>{" "}
      <button onClick={handleSearch}>Search</button>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Club</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => (
            <tr key={participant.id}>
              <td>
                <Link to={`/participants/${participant.id}`}>
                  {participant.firstName} {participant.lastName}
                </Link>
              </td>
              <td>{participant.gender}</td>
              <td>{participant.age}</td>
              <td>{participant.club}</td>
              <td>
                <button
                  onClick={() => handleEdit(participant.id)}
                  className="btn-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(participant.id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {participants.length === 0 && <p>No participants found.</p>}
    </div>
  );
};

export default ParticipantList;
