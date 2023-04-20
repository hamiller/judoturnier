import { Wettkaempfer } from "../../model/wettkaempfer";
import { Begegnung } from "../../model/begegnung";
import { Algorithmus } from "../algorithmus.interface";

import { getLogger } from '../logger';
import { WettkampfGruppe } from "../../model/wettkampfgruppe";
import { GewichtsklassenGruppe } from "../../model/gewichtsklassengruppe";

const logger = getLogger('RoundRobin');

export class RoundRobin implements Algorithmus {

  erstelleWettkampfGruppen(gruppenid: number, gewichtsklassenGruppe: GewichtsklassenGruppe, mattenAnzahl: number): WettkampfGruppe[] {
    logger.info("Berechne Begenungen mit RoundRobin");

    const gruppen: Wettkaempfer[][] = [];
    const begegnungen: Begegnung[] = [];
    const maxGroupSize = 4;

    // Group wettkaempfer by club
    const vereinsGruppen = this.gruppiereWettkaempferBeiVerein(gewichtsklassenGruppe.teilnehmer);
    
    // Create groups of up to maxGroupSize wettkaempfer
    for (const vereinsGruppe of vereinsGruppen) {
      let gruppe: Wettkaempfer[] = [];
      
      for (const wettkaempfer of vereinsGruppe) {
        if (gruppe.length === maxGroupSize) {
          gruppen.push(gruppe);
          gruppe = [];
        }
        
        gruppe.push(wettkaempfer);
      }
      
      if (gruppe.length > 0) {
        gruppen.push(gruppe);
      }
    }
    
    // Round-robin tournament within each group
    for (const gruppe of gruppen) {
      const begegnungen = this.brechneRoundRobinBegegnungen(gruppe);
      begegnungen.push(...begegnungen);
    }
    
    console.log(begegnungen);

    return [];
  }

  private gruppiereWettkaempferBeiVerein(wettkaempfer: Wettkaempfer[]): Wettkaempfer[][] {
    const vereinsids = new Set(wettkaempfer.map(p => p.verein.id));
    const vereinsGruppe: Wettkaempfer[][] = [];
    
    for (const vereinsid of vereinsids) {
      const vereinsMitglieder = wettkaempfer.filter(p => p.verein.id === vereinsid);
      vereinsGruppe.push(vereinsMitglieder);
    }
    
    return vereinsGruppe;
  }
  
  private brechneRoundRobinBegegnungen(wettkaempfer: Wettkaempfer[]): Begegnung[] {
    const begegnungen: Begegnung[] = [];
    
    for (let i = 0; i < wettkaempfer.length; i++) {
      for (let j = i + 1; j < wettkaempfer.length; j++) {
        const wettkaempfer1 = wettkaempfer[i];
        const wettkaempfer2 = wettkaempfer[j];
        
        if (this.canFight(wettkaempfer1, wettkaempfer2, begegnungen)) {
          begegnungen.push({ wettkaempfer1, wettkaempfer2 });
        }
      }
    }
    
    return begegnungen;
  }
  
  private canFight(wettkaempfer1: Wettkaempfer, wettkaempfer2: Wettkaempfer, begegnungen: Begegnung[]): boolean {
    // Participants from the same club should not fight against each other
    if (wettkaempfer1.verein === wettkaempfer2.verein) {
      return false;
    }
    
    // Check if wettkaempfer have already fought against each other
    const hasPlayedAgainst = begegnungen.some(b => {
      return (b.wettkaempfer1 === wettkaempfer1 && b.wettkaempfer2 === wettkaempfer2) || (b.wettkaempfer1 === wettkaempfer2 && b.wettkaempfer2 === wettkaempfer1);
    });
    
    return !hasPlayedAgainst;
  }
}