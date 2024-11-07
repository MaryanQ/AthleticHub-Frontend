import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Participant } from "../type/Participant";
import {
  createParticipant,
  updateParticipant,
  getParticipantById,
} from "../service/apiFacade";
import { Gender, AgeGroup } from "../type/enums";

const ParticipantForm = () => {
  const { id } = useParams<{ id: string }>();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getParticipantById(parseInt(id)).then(setParticipant);
    } else {
      setParticipant({
        id: 0,
        firstName: "",
        lastName: "",
        age: 0,
        gender: Gender.MALE,
        club: "",
        ageGroup: AgeGroup.YOUTH,
        results: [],
        disciplines: [],
      });
    }
  }, [id]);

  const handleSave = async () => {
    if (id && participant) {
      await updateParticipant(parseInt(id), participant);
    } else if (participant) {
      await createParticipant(participant);
    }
    navigate("/participants"); // Go back to participant list
  };

  if (!participant) return <p>Loading...</p>;

  return (
    <div>
      <h2>{id ? "Edit Participant" : "Add Participant"}</h2>
      <input
        type="text"
        placeholder="First Name"
        value={participant.firstName}
        onChange={(e) =>
          setParticipant({ ...participant, firstName: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Last Name"
        value={participant.lastName}
        onChange={(e) =>
          setParticipant({ ...participant, lastName: e.target.value })
        }
      />
      <input
        type="number"
        placeholder="Age"
        value={participant.age}
        onChange={(e) =>
          setParticipant({ ...participant, age: parseInt(e.target.value) })
        }
      />
      {/* Add more fields as needed */}
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default ParticipantForm;
