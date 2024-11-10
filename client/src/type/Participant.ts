// types.ts
import { Gender, AgeGroup } from "./enums";
import { Result } from "./Result";
import { Discipline } from "./Discipline";

export interface Participant {
  id: number;
  firstName: string;
  lastName: string;
  gender: Gender;
  age: number | undefined;
  club: string;
  ageGroup: AgeGroup;
  results: Result[];
  disciplines?: Discipline[];
}
