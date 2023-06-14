import { Wettkaempfer } from "../../model/wettkaempfer";
import { Begegnung } from "../../model/begegnung";
import { Algorithmus } from "../algorithmus.interface";

import { getLogger } from '../logger';
import { WettkampfGruppe } from "../../model/wettkampfgruppe";
import { GewichtsklassenGruppe } from "../../model/gewichtsklassengruppe";

const logger = getLogger('SechserPool');

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
      const sortedBegegnungen = this.sortiereBegegnungen(begegnungen, mattenAnzahl);
      
      const id: string = ((gruppenid+1) * 10).toString() + i.toString(); // ids erstellen und konkatenieren
      const wettkampfGruppe: WettkampfGruppe = {
        id: parseInt(id),
        name: gewichtsklassenGruppe.name,
        typ: "(" + gewichtsklassenGruppe.gewichtsklasse.name + " " + gewichtsklassenGruppe.altersKlasse + ")",
        begegnungen: sortedBegegnungen
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

  private sortiereBegegnungen(begegnungen: Begegnung[], mattenAnzahl: number): Begegnung[] {
    // Sortiere die Begegnungen nach Kämpfern
    begegnungen.sort((a, b) => {
      if (a.wettkaempfer1 === b.wettkaempfer1) {
        return a.wettkaempfer2.name.localeCompare(b.wettkaempfer2.name);
      }
      return a.wettkaempfer1.name.localeCompare(b.wettkaempfer1.name);
    });

    // Überprüfe jede Begegnung, um sicherzustellen, dass kein Kämpfer in zwei aufeinanderfolgenden Begegnungen auftritt
    for (let i = 1; i < begegnungen.length; i++) {
      if (begegnungen[i].wettkaempfer1 === begegnungen[i - 1].wettkaempfer1) {
        const temp = begegnungen[i];
        begegnungen[i] = begegnungen[i - 1];
        begegnungen[i - 1] = temp;
      }
    }

    return begegnungen;
  }

}