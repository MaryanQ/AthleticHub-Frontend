// types.ts

import { Discipline } from "./Discipline";

export interface Result {
  id: number;
  date: string; // Use ISO string format for dates
  resultValue: number;
  participantId: number;
  discipline: Discipline | null; // Allows null
}
