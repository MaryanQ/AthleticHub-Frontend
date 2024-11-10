import React, { useEffect, useState } from "react";
import { Participant } from "../type/Participant";
import {
  getAllParticipants,
  deleteParticipant,
  getFilteredParticipants,
} from "../service/apiFacade";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ParticipantList.css";

const ParticipantList: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [gender, setGender] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [club, setClub] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [clubs, setClubs] = useState<string[]>([]);
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const navigate = useNavigate();

  // Fetch participants on mount
  useEffect(() => {
    fetchParticipants();
    initializeDropdowns();
  }, []);

  const fetchParticipants = async () => {
    try {
      const data = await getAllParticipants();
      setParticipants(data);
    } catch (error) {
      console.error("Error fetching participants:", error);
      setError("Failed to fetch participants.");
    }
  };

  const initializeDropdowns = async () => {
    // Update these lists based on backend or initial data
    setClubs([
      "Lynhurtig IF",
      "Storm Klub",
      "Vikingerne Atletik",
      "Nordstjernen IF",
      "Falke IF",
    ]);
    setDisciplines([
      "100m Løb",
      "Maraton",
      "Højdespring",
      "Længdespring",
      "Diskoskast",
    ]);
  };

  const handleSearch = async () => {
    const filters: { [key: string]: string } = {};
    if (searchTerm) filters.name = searchTerm;
    if (gender) filters.gender = gender;
    if (ageGroup) filters.ageGroup = ageGroupMapping[ageGroup] || ""; // Map ageGroup to backend format
    if (club) filters.club = club;
    if (discipline) filters.discipline = discipline;

    try {
      const data = await getFilteredParticipants(filters);
      setParticipants(data);
    } catch (error) {
      console.error("Error searching participants:", error);
      setError("Failed to search participants.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteParticipant(id);
      setParticipants((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting participant:", error);
      setError("Failed to delete participant.");
    }
  };

  const handleAdd = () => navigate("/participants/new");

  const ageGroupMapping: { [key: string]: string } = {
    CHILD: "6-9",
    YOUTH: "10-13",
    JUNIOR: "14-22",
    ADULT: "23-40",
    SENIOR: "41+",
  };

  // Navigate to edit page
  const handleEdit = (id: number) => {
    navigate(`/edit-participant/${id}`);
  };

  return (
    <div className="participant-list">
      <h2>Participants</h2>
      <div className="search-filters">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>

        <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
          <option value="">Select Age Group</option>
          <option value="CHILD">6-9</option>
          <option value="YOUTH">10-13</option>
          <option value="JUNIOR">14-22</option>
          <option value="ADULT">23-40</option>
          <option value="SENIOR">41+</option>
        </select>

        <select value={club} onChange={(e) => setClub(e.target.value)}>
          <option value="">Select Club</option>
          {clubs.map((club, index) => (
            <option key={index} value={club}>
              {club}
            </option>
          ))}
        </select>

        <select
          value={discipline}
          onChange={(e) => setDiscipline(e.target.value)}
        >
          <option value="">Select Discipline</option>
          {disciplines.map((discipline, index) => (
            <option key={index} value={discipline}>
              {discipline}
            </option>
          ))}
        </select>

        <button onClick={handleAdd}>Add Participant</button>
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <p className="error">{error}</p>}

      <table className="participants-table">
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
