import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Participant } from "../type/Participant";
import { Discipline } from "../type/Discipline";
import { Result } from "../type/Result";
import {
  createParticipant,
  getAllDisciplines,
  addDiscipline,
} from "../service/apiFacade";
import { Gender, AgeGroup, ResultType } from "../type/enums";
import "../styles/AddParticipantForm.css";

const AddParticipantForm: React.FC = () => {
  const [participant, setParticipant] = useState<Participant>({
    id: 0,
    firstName: "",
    lastName: "",
    gender: Gender.MALE,
    age: undefined,
    club: "",
    ageGroup: AgeGroup.ADULT,
    disciplines: [],
    results: [],
  });
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [selectedDisciplines, setSelectedDisciplines] = useState<Discipline[]>(
    []
  );
  const [results, setResults] = useState<Result[]>([]);
  const [clubs, setClubs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingNewDiscipline, setIsCreatingNewDiscipline] = useState(false);
  const [newDisciplineName, setNewDisciplineName] = useState("");
  const [newDisciplineType, setNewDisciplineType] = useState<ResultType>(
    ResultType.TIME
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDisciplines = async () => {
      try {
        const data = await getAllDisciplines();
        setDisciplines(data);
      } catch (err) {
        console.error("Error fetching disciplines:", err);
      }
    };

    // Predefined club names
    setClubs([
      "Lynhurtig IF",
      "Storm Klub",
      "Vikingerne Atletik",
      "Nordstjernen IF",
      "Falke IF",
    ]);

    fetchDisciplines();
  }, []);

  // Age group determination based on age
  const determineAgeGroup = (age: number): AgeGroup => {
    if (age >= 6 && age <= 9) return AgeGroup.CHILD;
    if (age >= 10 && age <= 13) return AgeGroup.YOUTH;
    if (age >= 14 && age <= 22) return AgeGroup.JUNIOR;
    if (age >= 23 && age <= 40) return AgeGroup.ADULT;
    return AgeGroup.SENIOR;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setParticipant((prev) => {
      const updatedParticipant = { ...prev, [name]: value };
      if (name === "age") {
        const age = Number(value);
        updatedParticipant.age = age;
        updatedParticipant.ageGroup = determineAgeGroup(age);
      }
      return updatedParticipant;
    });
  };

  const handleDisciplineSelect = (disciplineId: number) => {
    const discipline = disciplines.find((d) => d.id === disciplineId);
    if (discipline && !selectedDisciplines.includes(discipline)) {
      setSelectedDisciplines([...selectedDisciplines, discipline]);
    }
  };

  const handleNewDisciplineSubmit = async () => {
    if (!newDisciplineName.trim()) return;

    try {
      const newDiscipline: Discipline = {
        id: 0, // Temporary id, will be replaced by the server
        name: newDisciplineName,
        resultType: newDisciplineType,
        results: [],
      };

      const createdDiscipline = await addDiscipline(newDiscipline);

      setDisciplines((prev) => [...prev, createdDiscipline]);
      setSelectedDisciplines((prev) => [...prev, createdDiscipline]);

      setIsCreatingNewDiscipline(false);
      setNewDisciplineName("");
    } catch (err) {
      console.error("Error creating new discipline:", err);
      setError("Failed to create new discipline.");
    }
  };

  const addResult = () => {
    setResults([
      ...results,
      {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        resultValue: 0,
        discipline:
          selectedDisciplines.length > 0 ? selectedDisciplines[0] : null,
        participantId: participant.id,
        resultType: ResultType.TIME, // Default value; can be updated per result
      },
    ]);
  };

  const handleResultChange = (
    index: number,
    field: string,
    value: string | number,
    disciplineId?: number
  ) => {
    const updatedResults = [...results];
    updatedResults[index] = {
      ...updatedResults[index],
      [field]: value,
      discipline: disciplineId
        ? (disciplines.find((d) => d.id === disciplineId) ?? null)
        : updatedResults[index].discipline,
    };
    setResults(updatedResults);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const participantWithDetails = {
        ...participant,
        disciplines: selectedDisciplines,
        results,
      };
      await createParticipant(participantWithDetails);
      navigate("/participants");
    } catch (err) {
      console.error("Error creating participant:", err);
      setError("Failed to create participant.");
    }
  };

  return (
    <div className="add-participant-form">
      <h2>Add Participant</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Participant Basic Details */}
        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={participant.firstName}
          onChange={handleChange}
          required
        />
        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={participant.lastName}
          onChange={handleChange}
          required
        />
        <label>Gender:</label>
        <select
          name="gender"
          value={participant.gender}
          onChange={handleChange}
          required
        >
          {Object.values(Gender).map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={participant.age || ""}
          placeholder="Enter age"
          onChange={handleChange}
          required
        />
        <label>Club:</label>
        <select
          name="club"
          value={participant.club}
          onChange={handleChange}
          required
        >
          <option value="">Select Club</option>
          {clubs.map((club, index) => (
            <option key={index} value={club}>
              {club}
            </option>
          ))}
        </select>
        <label>Age Group:</label>
        <input
          type="text"
          name="ageGroup"
          value={participant.ageGroup}
          readOnly
        />

        {/* Discipline Selection or Creation */}
        <h3>Disciplines</h3>
        {!isCreatingNewDiscipline ? (
          <div>
            <select
              onChange={(e) => handleDisciplineSelect(Number(e.target.value))}
            >
              <option value="">Select Existing Discipline</option>
              {disciplines.map((discipline) => (
                <option key={discipline.id} value={discipline.id}>
                  {discipline.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setIsCreatingNewDiscipline(true)}
            >
              + Add New Discipline
            </button>
          </div>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Discipline Name"
              value={newDisciplineName}
              onChange={(e) => setNewDisciplineName(e.target.value)}
              required
            />
            <select
              value={newDisciplineType}
              onChange={(e) =>
                setNewDisciplineType(e.target.value as ResultType)
              }
            >
              <option value={ResultType.TIME}>TIME</option>
              <option value={ResultType.DISTANCE}>DISTANCE</option>
            </select>
            <button type="button" onClick={handleNewDisciplineSubmit}>
              Save Discipline
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingNewDiscipline(false)}
            >
              Cancel
            </button>
          </div>
        )}
        <ul>
          {selectedDisciplines.map((discipline) => (
            <li key={discipline.id}>{discipline.name}</li>
          ))}
        </ul>

        {/* Results Section */}
        <h3>Results</h3>
        <button type="button" onClick={addResult}>
          Add Result
        </button>
        {results.map((result, index) => (
          <div key={result.id}>
            <label>Date:</label>
            <input
              type="date"
              value={result.date}
              onChange={(e) =>
                handleResultChange(index, "date", e.target.value)
              }
            />
            <label>Result:</label>
            <input
              type="number"
              value={result.resultValue || ""}
              onChange={(e) =>
                handleResultChange(index, "resultValue", Number(e.target.value))
              }
            />
            <label>Result Type:</label>
            <select
              value={result.resultType}
              onChange={(e) =>
                handleResultChange(index, "resultType", e.target.value)
              }
            >
              {Object.values(ResultType).map((rt) => (
                <option key={rt} value={rt}>
                  {rt}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button type="submit">Create Participant</button>
      </form>
    </div>
  );
};

export default AddParticipantForm;
