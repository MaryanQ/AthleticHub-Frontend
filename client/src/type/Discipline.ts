// types.ts
import { ResultType } from "./enums";
import { Result } from "./Result";

export interface Discipline {
  id: number;
  name: string;
  resultType: ResultType;
  results: Result[];
}
