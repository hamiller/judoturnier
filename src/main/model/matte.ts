import { Begegnung } from "./begegnung";
import { WettkampfGruppe } from "./wettkampfgruppe";

export interface Matte {
  id: number;
  runden: Runde[];
}

export interface Runde {
  runde: number;
  gruppe: WettkampfGruppe;
  begegnungen: Begegnung[];
}