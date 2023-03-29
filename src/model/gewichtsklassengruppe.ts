import { Altersklasse } from "./altersklasse";
import { Geschlecht } from "./geschlecht";
import { Wettkaempfer } from "./wettkaempfer";
// import { Gewichtsklasse } from "./gewichtsklasse";

export interface GewichtsklassenGruppe {
  altersKlasse: Altersklasse,
  gruppenGeschlecht: Geschlecht,
  teilnehmer: Wettkaempfer[],
  name?: String
}