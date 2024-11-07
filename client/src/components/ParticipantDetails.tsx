import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Participant } from "../type/Participant";
import { getParticipantById } from "../service/apiFacade";

const ParticipantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [participant, setParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    if (id) getParticipantById(parseInt(id)).then(setParticipant);
  }, [id]);

  if (!participant) return <p>Loading...</p>;

  return (
    <div>
      <h2>
        {participant.firstName} {participant.lastName}
      </h2>
      <p>Gender: {participant.gender}</p>
      <p>Age: {participant.age}</p>
      <p>Club: {participant.club}</p>
      <h3>Disciplines</h3>
      <ul>
        {participant.disciplines.map((discipline) => (
          <li key={discipline.id}>{discipline.name}</li>
        ))}
      </ul>
      <h3>Results</h3>
      <ul>
        {participant.results.map((result) => (
          <li key={result.id}>
            Date: {result.date}, Value: {result.resultValue}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParticipantDetails;
