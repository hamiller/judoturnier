import { Wettkaempfer } from "../../model/wettkaempfer";
import { Begegnung } from "../../model/begegnung";
import { Algorithmus } from "../algorithmus.interface";

import { getLogger } from '../logger';
import { WettkampfGruppe } from "../../model/wettkampfgruppe";
import { GewichtsklassenGruppe } from "../../model/gewichtsklassengruppe";

const logger = getLogger('JederGegenJeden');

export class JederGegenJeden implements Algorithmus {

  MAX_TEILNEHMER_JE_GRUPPE = 6;

  erstelleWettkampfGruppen(gruppenid: number, gewichtsklassenGruppe: GewichtsklassenGruppe, mattenAnzahl: number): WettkampfGruppe[] {
    logger.debug("JederGegenJeden Algorithmus genutzt");

    const result: WettkampfGruppe[] = [];

    // erstellt Gruppen mit bis zu 6 Kämpfern
    const wettkaempferGruppen: Wettkaempfer[][] = this.splitArray(gewichtsklassenGruppe.teilnehmer, this.MAX_TEILNEHMER_JE_GRUPPE);
  
    // Alle möglichen Begegnungen in jeder Gruppe generieren
    for (let i = 0; i < wettkaempferGruppen.length; i++) {
      const wettkaempferGruppe = wettkaempferGruppen[i];
      
      const begegnungen = this.berechneBegegnungen(wettkaempferGruppe);

      const id: string = ((gruppenid+1) * 10).toString() + i.toString(); // ids erstellen und konkatenieren
      const wettkampfGruppe: WettkampfGruppe = {
        id: gewichtsklassenGruppe.id ? gewichtsklassenGruppe.id : parseInt(id),
        name: gewichtsklassenGruppe.name,
        typ: "(" + gewichtsklassenGruppe.minGewicht + "" + gewichtsklassenGruppe.maxGewicht + " " + gewichtsklassenGruppe.altersKlasse + ")",
        alleGruppenBegegnungen: begegnungen
      }
      result.push(wettkampfGruppe);
    }
    return result;
  }

  private berechneBegegnungen(teilnehmer: Wettkaempfer[]): Begegnung[][] {
    if (teilnehmer.length % 2 == 0) {
      return this.berechneBegegnungenMitGeraderAnzahl(teilnehmer);
    }

    return this.berechneBegegnungenMitUngeraderAnzahl(teilnehmer);
  }

  private berechneBegegnungenMitUngeraderAnzahl(teilnehmer: Wettkaempfer[]): Begegnung[][] {
    const teilnehmerZahl = teilnehmer.length;
    const anzahlRunden = teilnehmerZahl;
    const anzahlBegegnungenJeRunden = Math.floor(teilnehmerZahl / 2);
    const runden : Begegnung[][] = Array.from({ length: anzahlRunden }, () => Array(anzahlBegegnungenJeRunden).fill(null));

    for (let i = 0, k = 0; i < anzahlRunden; i++) {
        for (let j = -1; j < anzahlBegegnungenJeRunden; j++) {
            if (j >= 0) {
                runden[i][j] = { wettkaempfer1: teilnehmer[k], };
            }

            k++;
            if (k == anzahlRunden)
                k = 0;
        }
    }

    const letzteTeilnehmerZahl = teilnehmerZahl - 1;
    for (let i = 0, k = letzteTeilnehmerZahl; i < anzahlRunden; i++) {
        for (let j = 0; j < anzahlBegegnungenJeRunden; j++) {
            runden[i][j].wettkaempfer2 = teilnehmer[k];

            k--;

            if (k == -1)
                k = letzteTeilnehmerZahl;
        }
    }

    return runden;
  }


  private berechneBegegnungenMitGeraderAnzahl(teilnehmer: Wettkaempfer[]): Begegnung[][] {
    const teilnehmerZahl = teilnehmer.length;
    const anzahlRunden = teilnehmerZahl - 1;
    const anzahlBegegnungenJeRunden = Math.floor(teilnehmerZahl / 2);
    const runden : Begegnung[][] = Array.from({ length: anzahlRunden }, () => Array(anzahlBegegnungenJeRunden).fill(null));

    // Kämpfer 1 setzen
    for (let i = 0, k = 0; i < anzahlRunden; i++) {
      for (let j = 0; j < anzahlBegegnungenJeRunden; j++) {
        runden[i][j] = { wettkaempfer1: teilnehmer[k], };
        
        k++;
        if (k == anzahlRunden)
          k = 0;
      }
    }

    // Kämpfer 2 setzen
    for (let i = 0; i < anzahlRunden; i++) {
        if (i % 2 == 0) {
            runden[i][0].wettkaempfer2 = teilnehmer[teilnehmerZahl - 1];
        } else {
            runden[i][0].wettkaempfer2 = runden[i][0].wettkaempfer1;
            runden[i][0].wettkaempfer1 = teilnehmer[teilnehmerZahl - 1];
        }
    }

    const letzteUngeradeTeilnehmerZahl = teilnehmerZahl - 2;
    for (let i = 0, k = letzteUngeradeTeilnehmerZahl; i < anzahlRunden; i++) {
        for (let j = 1; j < anzahlBegegnungenJeRunden; j++) {
            runden[i][j].wettkaempfer2 = teilnehmer[k]

            k--;
            if (k == -1)
                k = letzteUngeradeTeilnehmerZahl;
        }
    }

    return runden;
  }

  private splitArray(arr: Wettkaempfer[], chunkSize: number): Wettkaempfer[][] {
    const result = [];
  
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      result.push(chunk);
    }
  
    return result;
  } 
}