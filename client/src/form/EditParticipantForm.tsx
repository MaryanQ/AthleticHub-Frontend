import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Participant } from "../type/Participant";
import { getParticipantById, updateParticipant } from "../service/apiFacade";
import ParticipantFormFields from "./ParticipantFormFields";

const EditParticipantForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const navigate = useNavigate();

  // Fetch the participant data by ID on component mount
  useEffect(() => {
    if (id) {
      getParticipantById(parseInt(id)).then((data) => {
        setParticipant({
          ...data,
          disciplines: data.disciplines ?? [],
          results: data.results ?? [],
        });
      });
    }
  }, [id]);

  // Log participant data for debugging
  useEffect(() => {
    console.log(
      "EditParticipantForm re-rendered with participant:",
      participant
    );
  }, [participant]);

  // Save updated participant data
  const handleSave = async () => {
    if (participant && id) {
      await updateParticipant(parseInt(id), participant);
      navigate("/participants"); // Navigate back to participants list after saving
    }
  };

  if (!participant) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Participant</h2>
      <ParticipantFormFields
        participant={participant}
        setParticipant={setParticipant}
        // Pass only edit-related props
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default EditParticipantForm;
