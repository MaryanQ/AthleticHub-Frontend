import { makeOptions, handleHttpErrors } from "./fetchUtils";
import { Participant } from "../type/Participant";
import { Result } from "../type/Result";
//import { Discipline } from "../type/Discipline";

const API_URL = "http://localhost:8081";

const Participant_URL = API_URL + "/api/participants";
//const Result_URL = API_URL + "/api/results";
//const Discipline_URL = API_URL + "/api/disciplines";

export const getAllParticipants = async (): Promise<Participant[]> => {
  const response = await fetch(Participant_URL);
  return handleHttpErrors(response);
};

// Get a participant by ID
export const getParticipantById = async (id: number): Promise<Participant> => {
  const response = await fetch(`${Participant_URL}/${id}`);
  return handleHttpErrors(response);
};

// Create a new participant
export const createParticipant = async (
  participant: Participant
): Promise<Participant> => {
  const options = makeOptions("POST", participant);
  const response = await fetch(Participant_URL, options);
  return handleHttpErrors(response);
};

// Update a participant
export const updateParticipant = async (
  id: number,
  updatedData: Partial<Participant>
): Promise<Participant> => {
  const options = makeOptions("PUT", updatedData);
  const response = await fetch(`${Participant_URL}/${id}`, options);
  return handleHttpErrors(response);
};

// Delete a participant
export const deleteParticipant = async (id: number): Promise<void> => {
  const options = makeOptions("DELETE", null);
  const response = await fetch(`${Participant_URL}/${id}`, options);
  return handleHttpErrors(response);
};

// 6. Search participants by name
export const searchParticipantsByName = async (
  name: string
): Promise<Participant[]> => {
  const response = await fetch(`${Participant_URL}/search?name=${name}`);
  return handleHttpErrors(response);
};

// 7. List participants with optional filters
export const listParticipants = async (filters: {
  gender?: string;
  ageGroup?: string;
  club?: string;
  discipline?: string;
}): Promise<Participant[]> => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await fetch(`${Participant_URL}/filter?${queryParams}`);
  return handleHttpErrors(response);
};

// 8. Add a discipline to a participant
export const addDisciplineToParticipant = async (
  participantId: number,
  disciplineId: number
): Promise<Participant> => {
  const options = makeOptions("POST", null);
  const response = await fetch(
    `${Participant_URL}/${participantId}/disciplines/${disciplineId}`,
    options
  );
  return handleHttpErrors(response);
};

// 9. Add a result for a participant in a specific discipline
export const addResultToParticipant = async (
  participantId: number,
  disciplineId: number,
  result: Result
): Promise<Result> => {
  const options = makeOptions("POST", result);
  const response = await fetch(
    `${Participant_URL}/${participantId}/disciplines/${disciplineId}/results`,
    options
  );
  return handleHttpErrors(response);
};
