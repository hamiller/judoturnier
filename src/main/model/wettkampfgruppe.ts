import { Begegnung } from "./begegnung";

export interface WettkampfGruppe {
  id: number;
  name: string;
  typ: string;
  begegnungsRunden: Begegnung[][];
}