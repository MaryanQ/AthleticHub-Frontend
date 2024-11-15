import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Participant } from "../type/Participant";
import { getParticipantById } from "../service/apiFacade";
import { ResultType } from "../type/enums";
import "../styles/PaticipantDetails.css";

const ParticipantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParticipant = async () => {
      try {
        const data = await getParticipantById(Number(id));
        setParticipant(data);
      } catch (err) {
        console.error("Error fetching participant details:", err);
        setError("Failed to fetch participant details.");
      }
    };

    if (id) fetchParticipant();
  }, [id]);

  const formatResultValue = (resultValue: number, resultType: ResultType) => {
    if (resultType === ResultType.TIME) {
      const totalMilliseconds = resultValue;
      const hours = Math.floor(totalMilliseconds / 3600000);
      const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
      const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
      const hundredths = Math.floor((totalMilliseconds % 1000) / 10);
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`;
    } else if (resultType === ResultType.DISTANCE) {
      const meters = Math.floor(resultValue);
      const centimeters = Math.floor((resultValue - meters) * 100);
      return `${meters} m ${centimeters} cm`;
    }
    return resultValue.toString();
  };

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="participant-detail">
      {participant ? (
        <>
          <h2>
            {participant.firstName} {participant.lastName}
          </h2>
          <p>Gender: {participant.gender}</p>
          <p>Age: {participant.age}</p>
          <p>Club: {participant.club}</p>
          <p>Age Group: {participant.ageGroup}</p>

          <h3>Disciplines</h3>
          {participant.disciplines && participant.disciplines.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Result Type</th>
                </tr>
              </thead>
              <tbody>
                {participant.disciplines.map((discipline) => (
                  <tr key={discipline.id}>
                    <td>{discipline.name}</td>
                    <td>{discipline.resultType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No disciplines found.</p>
          )}

          <h3>Results</h3>
          {participant.results && participant.results.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Result Value</th>
                </tr>
              </thead>
              <tbody>
                {participant.results.map((result) => (
                  <tr key={result.id}>
                    <td>{result.date}</td>
                    <td>
                      {formatResultValue(
                        result.resultValue,
                        result.discipline?.resultType || ResultType.TIME
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No results found.</p>
          )}
        </>
      ) : (
        <p>Loading participant details...</p>
      )}
    </div>
  );
};

export default ParticipantDetails;
