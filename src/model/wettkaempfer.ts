import { Verein } from "./verein";

export interface Wettkaempfer {
  name: string;
  geschlecht: string;
  alter: number;
  verein: Verein;
  gewicht: number;
}