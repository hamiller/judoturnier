import { Wettkaempfer } from "../../model/wettkaempfer";
import { Begegnung } from "../../model/begegnung";
import { Algorithmus } from "../algorithmus.interface";

import { getLogger } from '../logger';
import { WettkampfGruppe } from "../../model/wettkampfgruppe";
import { GewichtsklassenGruppe } from "../../model/gewichtsklassengruppe";
import { Sortierer } from "../../application/sortierer";

const logger = getLogger('SechserPool');
const sortierer = new Sortierer();

export class SechserPool implements Algorithmus {

  erstelleWettkampfGruppen(gruppenid: number, gewichtsklassenGruppe: GewichtsklassenGruppe, mattenAnzahl: number): WettkampfGruppe[] {
    logger.info("Berechne Begegnungen mit SechserPool");
    const result: WettkampfGruppe[] = [];

    // erstellt Gruppen mit bis zu 6 Kämpfern
    const groups = this.splitArray(gewichtsklassenGruppe.teilnehmer, 6);
  
    // Alle möglichen Begegnungen in jeder Gruppe generieren
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      const begegnungen = this.erstelleBegegnungen(group);
      const sortedBegegnungen = sortierer.sortiereBegegnungen(begegnungen);
      
      const id: string = ((gruppenid+1) * 10).toString() + i.toString(); // ids erstellen und konkatenieren
      const wettkampfGruppe: WettkampfGruppe = {
        id: parseInt(id),
        name: gewichtsklassenGruppe.name,
        typ: "(" + gewichtsklassenGruppe.gewichtsklasse.name + " " + gewichtsklassenGruppe.altersKlasse + ")",
        begegnungsRunden: [sortedBegegnungen]
      }

      result.push(wettkampfGruppe);
    }
  
    return result;
  }

  private splitArray(arr: any[], chunkSize: number): any[][] {
    const result = [];
  
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      result.push(chunk);
    }
  
    return result;
  }  

  private erstelleBegegnungen(group: Wettkaempfer[]): Begegnung[] {
    const n = group.length;
    const encounters: Begegnung[] = [];
  
    // Alle möglichen Begegnungen generieren
    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        const fighter1 = group[i];
        const fighter2 = group[j];
        encounters.push({wettkaempfer1: fighter1, wettkaempfer2: fighter2});
      }
    }
  
    return encounters;
  }

}