import { makeOptions, handleHttpErrors } from "./fetchUtils";
import { Participant } from "../type/Participant";
import { Result } from "../type/Result";
import { Discipline } from "../type/Discipline";
//import { Discipline } from "../type/Discipline";

const API_URL = "http://localhost:8081";

const Participant_URL = API_URL + "/api/participants";
const Result_URL = API_URL + "/api/results";
const Discipline_URL = API_URL + "/api/disciplines";

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

// updateParticipant
export const updateParticipant = async (
  id: number,
  participant: Participant
): Promise<Participant> => {
  const options = makeOptions("PUT", participant);
  const response = await fetch(`${Participant_URL}/${id}`, options);
  return handleHttpErrors(response); // Using handleHttpErrors for error handling
};

// Fetch all disciplines
export const getAllDisciplines = async (): Promise<Discipline[]> => {
  const options = makeOptions("GET", null);
  const response = await fetch(`${Discipline_URL}`, options);
  return handleHttpErrors(response);
};

// Fetch a discipline by ID
export const getDisciplineById = async (id: number): Promise<Discipline> => {
  const options = makeOptions("GET", null);
  const response = await fetch(`${Discipline_URL}/${id}`, options);
  return handleHttpErrors(response);
};

// Add a new discipline
export const addDiscipline = async (
  discipline: Discipline
): Promise<Discipline> => {
  const options = makeOptions("POST", discipline);
  const response = await fetch(`${Discipline_URL}`, options);
  return handleHttpErrors(response);
};

// Update an existing discipline
export const updateDiscipline = async (
  id: number,
  discipline: Discipline
): Promise<Discipline> => {
  const options = makeOptions("PUT", discipline);
  const response = await fetch(`${Discipline_URL}/${id}`, options);
  return handleHttpErrors(response);
};

// Delete a discipline
export const deleteDiscipline = async (id: number): Promise<void> => {
  const options = makeOptions("DELETE", null);
  const response = await fetch(`${Discipline_URL}/${id}`, options);
  return handleHttpErrors(response);
};

// Search disciplines by name
export const getFilteredParticipants = async (
  filters: { [key: string]: string } = {}
): Promise<Participant[]> => {
  const query = new URLSearchParams(filters).toString();
  const response = await fetch(`${Participant_URL}/participants?${query}`);
  return handleHttpErrors(response);
};

export const getAllResults = async (): Promise<Result[]> => {
  const response = await fetch(Result_URL);
  return handleHttpErrors(response);
};

export const getResultById = async (id: number): Promise<Result> => {
  const response = await fetch(`${Result_URL}/${id}`);
  return handleHttpErrors(response);
};

export const createResult = async (result: Result): Promise<Result> => {
  const options = makeOptions("POST", result);
  const response = await fetch(Result_URL, options);
  return handleHttpErrors(response);
};

export const updateResult = async (
  id: number,
  result: Result
): Promise<Result> => {
  const options = makeOptions("PUT", result);
  const response = await fetch(`${Result_URL}/${id}`, options);
  return handleHttpErrors(response);
};

export const deleteResult = async (id: number): Promise<void> => {
  const options = makeOptions("DELETE", null);
  const response = await fetch(`${Result_URL}/${id}`, options);
  return handleHttpErrors(response);
};
