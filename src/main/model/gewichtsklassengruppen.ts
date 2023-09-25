import { Altersklasse } from "./altersklasse";
import { GewichtsklassenGruppe } from "./gewichtsklassengruppe";

export interface GewichtsklassenGruppen {
  altersKlasse: Altersklasse,
  gruppen: GewichtsklassenGruppe[]
}