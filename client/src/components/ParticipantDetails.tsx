import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Participant } from "../type/Participant";
import { getParticipantById } from "../service/apiFacade";

const ParticipantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [participant, setParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    if (id) {
      getParticipantById(parseInt(id))
        .then((data) => {
          if (data) {
            setParticipant(data);
          } else {
            console.error("Participant not found");
          }
        })
        .catch((error) => console.error("Error fetching participant:", error));
    }
  }, [id]);

  if (!participant) return <p>Loading...</p>;

  return (
    <div>
      <h2>
        {participant.firstName} {participant.lastName}
      </h2>
      <p>
        <strong>Gender:</strong> {participant.gender}
      </p>
      <p>
        <strong>Age:</strong> {participant.age}
      </p>
      <p>
        <strong>Club:</strong> {participant.club}
      </p>
      <p>
        <strong>Age Group:</strong> {participant.ageGroup}
      </p>

      {/* Disciplines Section */}
      {/* Disciplines Section */}
      <h3>Disciplines</h3>
      {participant.disciplines && participant.disciplines.length > 0 ? (
        <ul>
          {participant.disciplines.map((discipline, index) => (
            <li key={`${discipline.id}-${index}`}>
              <p>
                <strong>Name:</strong> {discipline.name}
              </p>
              <p>
                <strong>Type:</strong> {discipline.resultType}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No disciplines available.</p>
      )}

      {/* Results Section */}
      <h3>Results</h3>
      {participant.results.length > 0 ? (
        <ul>
          {participant.results.map((result, index) => (
            <li key={`${result.id}-${index}`}>
              <p>
                <strong>Date:</strong> {result.date}
              </p>
              <p>
                <strong>Result Value:</strong> {result.resultValue}
              </p>
              {result.discipline && (
                <p>
                  <strong>Discipline:</strong> {result.discipline.name}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No results available.</p>
      )}
    </div>
  );
};

export default ParticipantDetails;
