import { Altersklasse } from "./altersklasse";
import { Geschlecht } from "./geschlecht";
import { Wettkaempfer } from "./wettkaempfer";

export interface GewichtsklassenGruppe {
  id?: number;
  altersKlasse: Altersklasse,
  gruppenGeschlecht: Geschlecht,
  teilnehmer: Wettkaempfer[],
  name: string
  minGewicht: number,
  maxGewicht: number,
}