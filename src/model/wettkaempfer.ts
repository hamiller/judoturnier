import { Verein } from "./verein";
import { Geschlecht } from "./geschlecht";
import { Altersklasse } from "./altersklasse";

export interface Wettkaempfer {
  id?: number;
  name: string;
  geschlecht: Geschlecht;
  altersklasse: Altersklasse;
  verein: Verein;
  gewicht?: number;
}