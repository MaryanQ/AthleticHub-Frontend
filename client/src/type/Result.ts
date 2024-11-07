// types.ts
import { Participant } from "./Participant";
import { Discipline } from "./Discipline";

export interface Result {
  id: number;
  date: string; // Use ISO string format for dates
  resultValue: string;
  participant: Participant;
  discipline: Discipline;
}
