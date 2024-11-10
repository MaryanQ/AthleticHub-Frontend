// EditParticipantForm.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Participant } from "../type/Participant";
import { Discipline } from "../type/Discipline";
import { Result } from "../type/Result";
import {
  getParticipantById,
  updateParticipant,
  getAllDisciplines,
} from "../service/apiFacade";
import { Gender, AgeGroup, ResultType } from "../type/enums";
import "../styles/AddParticipantForm.css";

const EditParticipantForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [selectedDisciplines, setSelectedDisciplines] = useState<Discipline[]>(
    []
  );
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParticipantData = async () => {
      if (id) {
        try {
          const data = await getParticipantById(Number(id));
          setParticipant(data);
          setSelectedDisciplines(data.disciplines || []);
          setResults(data.results || []);
        } catch (err) {
          console.error("Error fetching participant:", err);
          setError("Failed to load participant details.");
        }
      }
    };

    const fetchDisciplines = async () => {
      try {
        const data = await getAllDisciplines();
        setDisciplines(data);
      } catch (err) {
        console.error("Error fetching disciplines:", err);
      }
    };

    fetchParticipantData();
    fetchDisciplines();
  }, [id]);

  if (!participant) {
    return <p>Loading...</p>;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setParticipant({ ...participant, [name]: value });
  };

  const handleDisciplineChange = (discipline: Discipline) => {
    if (selectedDisciplines.find((d) => d.id === discipline.id)) {
      setSelectedDisciplines((prev) =>
        prev.filter((d) => d.id !== discipline.id)
      );
    } else {
      setSelectedDisciplines((prev) => [...prev, discipline]);
    }
  };

  const addResult = () => {
    if (selectedDisciplines.length > 0) {
      setResults([
        ...results,
        {
          id: Date.now(),
          date: new Date().toISOString().split("T")[0],
          resultValue: 0,
          resultType: ResultType.TIME,
          discipline: selectedDisciplines[0],
          participantId: participant.id,
        },
      ]);
    } else {
      setError("Please select a discipline before adding a result.");
    }
  };

  const handleResultChange = (
    index: number,
    field: "resultValue" | "date" | "discipline",
    value: string | number | Discipline
  ) => {
    const updatedResults = [...results];
    if (field === "discipline") {
      updatedResults[index] = {
        ...updatedResults[index],
        discipline: value as Discipline,
      };
    } else {
      updatedResults[index] = {
        ...updatedResults[index],
        [field]: field === "resultValue" ? Number(value) : value,
      };
    }
    setResults(updatedResults);
  };

  const removeResult = (index: number) => {
    const updatedResults = results.filter((_, i) => i !== index);
    setResults(updatedResults);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = results.every(
      (result) => result.discipline && result.discipline.id
    );
    if (!isValid) {
      setError("Each result must have an associated discipline.");
      return;
    }

    try {
      const updatedParticipant = {
        ...participant,
        disciplines: selectedDisciplines,
        results,
      };
      await updateParticipant(participant.id, updatedParticipant);
      navigate("/participants");
    } catch (err) {
      console.error("Error updating participant:", err);
      setError("Failed to update participant.");
    }
  };

  return (
    <div className="add-participant-form">
      <h2>Edit Participant</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={participant.firstName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={participant.lastName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Gender:
          <select
            name="gender"
            value={participant.gender}
            onChange={handleChange}
            required
          >
            <option value={Gender.MALE}>Male</option>
            <option value={Gender.FEMALE}>Female</option>
          </select>
        </label>
        <label>
          Age:
          <input
            type="number"
            name="age"
            value={participant.age}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Club:
          <input
            type="text"
            name="club"
            value={participant.club}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Age Group:
          <select
            name="ageGroup"
            value={participant.ageGroup}
            onChange={handleChange}
            required
          >
            <option value={AgeGroup.CHILD}>Child</option>
            <option value={AgeGroup.YOUTH}>Youth</option>
            <option value={AgeGroup.JUNIOR}>Junior</option>
            <option value={AgeGroup.ADULT}>Adult</option>
            <option value={AgeGroup.SENIOR}>Senior</option>
          </select>
        </label>

        <h3>Disciplines</h3>
        <div>
          {selectedDisciplines.map((discipline) => (
            <div key={discipline.id}>
              {discipline.name}
              <button
                type="button"
                onClick={() => handleDisciplineChange(discipline)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <select
          onChange={(e) =>
            handleDisciplineChange(
              disciplines.find((d) => d.id === Number(e.target.value))!
            )
          }
          value=""
        >
          <option value="">Add Discipline</option>
          {disciplines.map((discipline) => (
            <option key={discipline.id} value={discipline.id}>
              {discipline.name}
            </option>
          ))}
        </select>

        <h3>Results</h3>
        <button type="button" onClick={addResult}>
          Add Result
        </button>
        {results.map((result, index) => (
          <div key={result.id} className="result-entry">
            <label>
              Date:
              <input
                type="date"
                value={result.date}
                onChange={(e) =>
                  handleResultChange(index, "date", e.target.value)
                }
              />
            </label>
            <label>
              Result:
              <input
                type="number"
                value={result.resultValue}
                onChange={(e) =>
                  handleResultChange(index, "resultValue", e.target.value)
                }
              />
            </label>
            <label>
              Discipline:
              <select
                value={result.discipline?.id || ""}
                onChange={(e) => {
                  const selectedDiscipline = disciplines.find(
                    (d) => d.id === Number(e.target.value)
                  );
                  if (selectedDiscipline) {
                    handleResultChange(index, "discipline", selectedDiscipline);
                  }
                }}
              >
                <option value="">Select Discipline</option>
                {disciplines.map((disc) => (
                  <option key={disc.id} value={disc.id}>
                    {disc.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => removeResult(index)}
              className="remove-result"
            >
              Remove Result
            </button>
          </div>
        ))}

        <button type="submit">Update Participant</button>
      </form>
    </div>
  );
};

export default EditParticipantForm;
