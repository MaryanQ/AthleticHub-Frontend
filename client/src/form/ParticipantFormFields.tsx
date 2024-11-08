import React from "react";
import { Participant } from "../type/Participant";
import { Gender, AgeGroup, ResultType } from "../type/enums";
import { Discipline } from "../type/Discipline";
import { Result } from "../type/Result";
import {
  addResultToParticipant,
  updateDisciplineForParticipant,
  updateResultForParticipant,
} from "../service/apiFacade";

type Props = {
  participant: Participant | null;
  setParticipant: React.Dispatch<React.SetStateAction<Participant | null>>;
  handleDeleteDiscipline?: (disciplineId: number) => void;
  handleDeleteResult?: (resultId: number) => void;
};

const ParticipantFormFields: React.FC<Props> = ({
  participant,
  setParticipant,
  handleDeleteDiscipline,
  handleDeleteResult,
}) => {
  if (!participant) return <p>Loading participant data...</p>;

  console.log("Rendering ParticipantFormFields with participant:", participant);

  const disciplines = participant.disciplines ?? [];
  const results = participant.results ?? [];

  const handleFieldChange = (
    field: keyof Participant,
    value: string | number | Gender | AgeGroup
  ) => {
    setParticipant((prevParticipant) => ({
      ...prevParticipant!,
      [field]: value,
    }));
  };

  const handleAddResult = async () => {
    if (disciplines.length === 0) {
      alert("No disciplines available. Please add a discipline first.");
      return;
    }

    // Select the first discipline (or let user choose)
    const disciplineId = disciplines[0].id;
    if (!disciplineId) {
      console.error("Cannot add result without a valid discipline ID.");
      alert("A valid discipline is required to add a result.");
      return;
    }

    const newResult: Result = {
      id: Date.now(), // Temporary ID for frontend
      date: new Date().toISOString().split("T")[0], // Current date
      resultValue: 0, // Default result value
      discipline: { ...disciplines[0] }, // Ensure discipline is included
      participantId: participant!.id,
    };

    try {
      const addedResult = await addResultToParticipant(
        participant!.id,
        disciplineId,
        newResult
      );

      setParticipant((prevParticipant) => ({
        ...prevParticipant!,
        results: [...(prevParticipant!.results || []), addedResult],
      }));
    } catch (error) {
      console.error("Failed to add result:", error);
      console.log("Participant object on render:", participant);
      console.log("Results array on render:", results);
      results.forEach((result, index) => {
        console.log(`Result ${index}:`, result);
        if (!result.discipline || !result.discipline.id) {
          console.error(
            `Discipline is missing or invalid for result at index ${index}`
          );
        } else {
          console.log(
            `Valid discipline found for result at index ${index}`,
            result.discipline
          );
        }
      });
    }
  };

  const handleDisciplineChange = async (
    index: number,
    field: keyof Discipline,
    value: string | ResultType
  ) => {
    const updatedDiscipline = { ...disciplines[index], [field]: value };
    const disciplineId = updatedDiscipline.id;

    try {
      // Update discipline on the server
      const updatedData = await updateDisciplineForParticipant(
        participant!.id,
        disciplineId,
        updatedDiscipline
      );

      // Update discipline in the participant's state after server confirmation
      setParticipant((prevParticipant) => {
        if (!prevParticipant) return prevParticipant;

        const updatedDisciplines = (prevParticipant.disciplines ?? []).map(
          (d, i) => (i === index ? updatedData : d)
        );

        return { ...prevParticipant, disciplines: updatedDisciplines };
      });
    } catch (error) {
      console.error("Failed to update discipline:", error);
    }
  };

  const handleResultChange = async (
    index: number,
    field: keyof Result,
    value: string | number
  ) => {
    const updatedResult = { ...results[index], [field]: value };
    const resultId = updatedResult.id;
    const disciplineId = updatedResult.discipline?.id;

    if (!disciplineId) {
      console.error("Discipline ID is missing or invalid for this result.");
      alert(
        "Each result must be associated with a valid discipline. Please add a discipline first."
      );
      return;
    }

    try {
      const updatedData = await updateResultForParticipant(
        participant!.id,
        disciplineId,
        resultId,
        updatedResult
      );

      setParticipant((prevParticipant) => {
        if (!prevParticipant) return prevParticipant;
        const updatedResults = prevParticipant.results.map((r, i) =>
          i === index ? updatedData : r
        );
        return { ...prevParticipant, results: updatedResults };
      });
    } catch (error) {
      console.error("Failed to update result:", error);
    }
  };

  return (
    <>
      {/* Participant Information */}
      <input
        type="text"
        placeholder="First Name"
        value={participant.firstName}
        onChange={(e) => handleFieldChange("firstName", e.target.value)}
      />

      <input
        type="text"
        placeholder="Last Name"
        value={participant.lastName}
        onChange={(e) => handleFieldChange("lastName", e.target.value)}
      />

      <select
        value={participant.gender}
        onChange={(e) => handleFieldChange("gender", e.target.value as Gender)}
      >
        <option value={Gender.MALE}>Male</option>
        <option value={Gender.FEMALE}>Female</option>
      </select>

      <input
        type="number"
        placeholder="Age"
        value={participant.age || ""}
        onChange={(e) =>
          handleFieldChange("age", parseInt(e.target.value) || 0)
        }
      />

      <input
        type="text"
        placeholder="Club"
        value={participant.club}
        onChange={(e) => handleFieldChange("club", e.target.value)}
      />

      <select
        value={participant.ageGroup}
        onChange={(e) =>
          handleFieldChange("ageGroup", e.target.value as AgeGroup)
        }
      >
        <option value={AgeGroup.YOUTH}>Youth</option>
        <option value={AgeGroup.ADULT}>Adult</option>
      </select>

      {/* Disciplines Section */}
      <div>
        <h3>Disciplines</h3>
        {disciplines.length === 0 ? (
          <p>No disciplines available.</p>
        ) : (
          disciplines.map((discipline, index) => (
            <div key={`${discipline.id}-${index}`}>
              <input
                type="text"
                placeholder={`Discipline ${index + 1}`}
                value={discipline.name}
                onChange={(e) =>
                  handleDisciplineChange(index, "name", e.target.value)
                }
              />

              <select
                value={discipline.resultType}
                onChange={(e) =>
                  handleDisciplineChange(
                    index,
                    "resultType",
                    e.target.value as ResultType
                  )
                }
              >
                <option value={ResultType.TIME}>Time</option>
                <option value={ResultType.DISTANCE}>Distance</option>
                <option value={ResultType.POINTS}>Score</option>
              </select>

              {handleDeleteDiscipline && (
                <button onClick={() => handleDeleteDiscipline(discipline.id)}>
                  Delete Discipline
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Results Section */}
      <div>
        <h3>Results</h3>
        {results.length === 0 ? (
          <p>No results available.</p>
        ) : (
          results.map((result, index) => (
            <div key={`${result.id}-${index}`}>
              <input
                type="date"
                value={result.date}
                onChange={(e) =>
                  handleResultChange(index, "date", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Result Value"
                value={result.resultValue || ""}
                onChange={(e) =>
                  handleResultChange(
                    index,
                    "resultValue",
                    parseFloat(e.target.value) || 0
                  )
                }
              />
              {handleDeleteResult && (
                <button onClick={() => handleDeleteResult(result.id)}>
                  Delete Result
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Result button placeholder */}
      <button onClick={handleAddResult}>Add Result</button>
    </>
  );
};

export default ParticipantFormFields;
