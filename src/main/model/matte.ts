import { Altersklasse } from "./altersklasse";
import { Begegnung } from "./begegnung";
import { WettkampfGruppe } from "./wettkampfgruppe";

export interface Matte {
  id: number;
  runden: Runde[];
  gruppenRunden?: GruppenRunde[];
}

export interface Runde {
  id: number;
  matten_runde: number;
  gruppen_runde?: number; 
  rundeTotal: number|undefined;
  matte_id?: number;
  altersklasse: Altersklasse;
  gruppe: WettkampfGruppe;
  begegnungen: Begegnung[];
}

export interface GruppenRunde {
  runden: Runde[];
}