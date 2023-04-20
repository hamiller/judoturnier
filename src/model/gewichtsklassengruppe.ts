import { Altersklasse } from "./altersklasse";
import { Geschlecht } from "./geschlecht";
import { Gewichtsklasse } from "./gewichtsklasse";
import { Wettkaempfer } from "./wettkaempfer";

export interface GewichtsklassenGruppe {
  altersKlasse: Altersklasse,
  gruppenGeschlecht: Geschlecht,
  teilnehmer: Wettkaempfer[],
  gewichtsklasse: Gewichtsklasse,
  name?: string
}