import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Participant } from "../type/Participant";
import { createParticipant } from "../service/apiFacade";
import ParticipantFormFields from "./ParticipantFormFields";
import { Gender, AgeGroup } from "../type/enums";

const CreateParticipantForm: React.FC = () => {
  const [participant, setParticipant] = useState<Participant | null>({
    id: 0,
    firstName: "",
    lastName: "",
    gender: Gender.MALE,
    age: 0,
    club: "",
    ageGroup: AgeGroup.YOUTH,
    results: [],
    disciplines: [],
  });

  const navigate = useNavigate();

  const handleSave = async () => {
    if (participant) {
      await createParticipant(participant);
      navigate("/participants");
    }
  };

  return (
    <div>
      <h2>Create Participant</h2>
      <ParticipantFormFields
        participant={participant}
        setParticipant={setParticipant}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default CreateParticipantForm;
