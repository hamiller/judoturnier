import { GewichtsklassenGruppe } from "../model/gewichtsklassengruppe";
import { WettkampfGruppe } from "../model/wettkampfgruppe";

export interface Algorithmus {
  erstelleWettkampfGruppen(gruppenid: number, gewichtsklassenGruppe: GewichtsklassenGruppe, mattenAnzahl: number):  WettkampfGruppe[]
}