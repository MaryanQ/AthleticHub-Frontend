import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Participant } from "../type/Participant";
import { Discipline } from "../type/Discipline";
import { Result } from "../type/Result";
import { createParticipant, getAllDisciplines } from "../service/apiFacade";
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
  const [error, setError] = useState<string | null>(null);
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
    fetchDisciplines();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setParticipant({ ...participant, [name]: value });
  };

  const handleDisciplineSelect = (disciplineId: number) => {
    const discipline = disciplines.find((d) => d.id === disciplineId);
    if (discipline && !selectedDisciplines.includes(discipline)) {
      setSelectedDisciplines([...selectedDisciplines, discipline]);
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
        resultType: ResultType.TIME,
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
            {Object.values(Gender).map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
        <label>
          Age:
          <input
            type="number"
            name="age"
            value={participant.age || ""}
            placeholder="Enter age"
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
            {Object.values(AgeGroup).map((ag) => (
              <option key={ag} value={ag}>
                {ag}
              </option>
            ))}
          </select>
        </label>

        <h3>Disciplines</h3>
        <select
          onChange={(e) => handleDisciplineSelect(Number(e.target.value))}
        >
          <option value="">Select Discipline</option>
          {disciplines.map((discipline) => (
            <option key={discipline.id} value={discipline.id}>
              {discipline.name}
            </option>
          ))}
        </select>
        <div>
          <ul>
            {selectedDisciplines.map((discipline) => (
              <li key={discipline.id}>{discipline.name}</li>
            ))}
          </ul>
        </div>

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
                value={result.resultValue || ""}
                placeholder="Enter result"
                onChange={(e) =>
                  handleResultChange(
                    index,
                    "resultValue",
                    Number(e.target.value)
                  )
                }
              />
            </label>
            <label>
              Discipline:
              <select
                onChange={(e) =>
                  handleResultChange(
                    index,
                    "discipline",
                    result.resultValue || "",
                    Number(e.target.value)
                  )
                }
                value={result.discipline?.id || ""}
              >
                <option value="">Select Discipline</option>
                {selectedDisciplines.map((discipline) => (
                  <option key={discipline.id} value={discipline.id}>
                    {discipline.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ))}

        <button type="submit">Create Participant</button>
      </form>
    </div>
  );
};

export default AddParticipantForm;
