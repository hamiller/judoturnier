import { Verein } from "./verein";

export interface Wettkaempfer {
  id?: number;
  name: string;
  geschlecht: string;
  alter: number;
  verein: Verein;
  gewicht?: number;
}