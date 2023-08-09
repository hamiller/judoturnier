import { Begegnung } from "./begegnung";
import { WettkampfGruppe } from "./wettkampfgruppe";

export interface Matte {
  id: number;
  runden: Runde[];
}

export interface Runde {
  id: number;
  runde: number;
  matte_id?: number;
  gruppe: WettkampfGruppe;
  begegnungen: Begegnung[];
}