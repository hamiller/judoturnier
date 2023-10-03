import { Altersklasse } from "./altersklasse";
import { GewichtsklassenGruppe } from "./gewichtsklassengruppe";

export interface GewichtsklassenGruppen {
  altersKlasse: Altersklasse,
  anzahlTeilnehmer: number,
  gruppen: GewichtsklassenGruppe[]
}