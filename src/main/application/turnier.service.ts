import { GewichtsklassenGruppe } from "../model/gewichtsklassengruppe";
import { Kampfsystem } from "../model/kampfsystem";
import { WettkampfGruppe } from "../model/wettkampfgruppe";
import { RoundRobin } from "./algorithm/round-robin";
import { SechserPool } from "./algorithm/sechser-pool";
import { Algorithmus } from "./algorithmus.interface";
import { getLogger } from './logger';
import { Einstellungen, TurnierTyp } from "../model/einstellungen";
import { EinstellungenRepository } from "../adapter/secondary/einstellungen.repository";
import { JederGegenJeden } from "./algorithm/jeder-gegen-jeden";
import { Matte, Runde } from "../model/matte";
import { GewichtsklassenGruppeService } from "./gewichtsklassengruppe.service";
import { WettkampfRepository } from "../adapter/secondary/wettkampf.repository";

import DatabasePool from "../config/db.config";
import { Begegnung } from "../model/begegnung";
import { Wertung } from "../model/wertung";

const logger = getLogger('TurnierService');
const pool: DatabasePool = new DatabasePool();
const einstellungenRepo = new EinstellungenRepository(pool);
const wettkampfRepo = new WettkampfRepository(pool);
const gewichtsklassenGruppenService = new GewichtsklassenGruppeService();
const ANZAHL_MATTEN = 2;

export class TurnierService {
  async isRandori(): Promise<boolean> {
    return await einstellungenRepo.load().then((einstellung) => einstellung.turnierTyp == TurnierTyp.randori).catch(() => {throw new Error("Turniertyp nicht gefunden")});
  }
  
  async ladeWertungFuerWettkampf(wettkampfId: number): Promise<Begegnung> {
    return wettkampfRepo.ladeWertung(wettkampfId);
  }

  async speichereWertung(wertung: Wertung): Promise<void> {
    await wettkampfRepo.speichereWertung(wertung)
  }
  
  async speichereTurnierEinstellungen(einstellungen: Einstellungen): Promise<Einstellungen> {
    logger.debug('Speichere Einstellungen');
    await einstellungenRepo.save(einstellungen);
    return einstellungenRepo.load();
  }
  
  async ladeTurnierEinstellungen(): Promise<Einstellungen> {
    logger.debug('Lade Einstellungen');
    return einstellungenRepo.load();
  }

  async ladeWettkampfreihenfolge(): Promise<Matte[]> {
    logger.debug("Lade Wettkampfreihenfolge");
    return wettkampfRepo.ladeMatten();
  }

  async erstelleWettkampfreihenfolge(): Promise<void> {
    logger.debug(`Erstelle Wettkampfreihenfolge...`);
    
    const einstellungen = await einstellungenRepo.load();
    const gwks = await gewichtsklassenGruppenService.lade();
    if (einstellungen.turnierTyp == TurnierTyp.randori) {
      const algorithmus = new JederGegenJeden();
      const wettkampfGruppen = await this.erstelleWettkampfgruppen(gwks, algorithmus);
      const matten: Matte[] = await this.erstelleGruppenReihenfolgeRandori(wettkampfGruppen);
    
      await wettkampfRepo.speichereMatten(matten);
      return;
    }
    else {
      const algorithmus = this.getAlgorithmus(Kampfsystem.ko);
      logger.error(`Turniermodus noch nicht implementiert!`);
    }
    
    return;
  }

  async loescheWettkampfreihenfolge(): Promise<void> {
    logger.debug(`Lösche Wettkampfreihenfolge...`);
    await wettkampfRepo.loescheAlleMatten();
    return;
  }

  erstelleWettkampfgruppen(gewichtsklassenGruppen: GewichtsklassenGruppe[], algorithmus: Algorithmus): WettkampfGruppe[] {
    // erstelle alle Begegnungen in jeder Gruppe
    let wettkampfGruppen: WettkampfGruppe[] = [];
    for (let i = 0; i < gewichtsklassenGruppen.length; i++) {
      const gruppe = gewichtsklassenGruppen[i];
      const wkg = algorithmus.erstelleWettkampfGruppen(i, gruppe, ANZAHL_MATTEN);
      wettkampfGruppen.push(...wkg);
    }
    return wettkampfGruppen;
  }
  
  erstelleGruppenReihenfolgeRandori(wettkampfGruppen: WettkampfGruppe[]): Matte[] {
    let matten : Matte[] = [];

    // Ausplitten der Begegnungen auf die Matten
    let wettkampfGruppenJeMatten = this.splitArray(wettkampfGruppen, ANZAHL_MATTEN);
    
    for (let m = 0; m < ANZAHL_MATTEN; m++) {
      matten.push({ id: m+1, runden: []});

      console.log("Matte " + m + ", Gruppen: ",wettkampfGruppenJeMatten[m].length, wettkampfGruppenJeMatten[m].reduce((s, w) => s + w.begegnungsRunden.length + ",", ""))
      
      // gerade Anzahl an Gruppen -> 2 Gruppen je Matte
      if (wettkampfGruppenJeMatten[m].length % 2 == 0) {


        for (let gruppenNr = 0; gruppenNr < wettkampfGruppenJeMatten[m].length /2; gruppenNr+=2) {
          console.log("entered loop 1a")
          const gruppe1 = wettkampfGruppenJeMatten[m][gruppenNr];
          const gruppe2 = wettkampfGruppenJeMatten[m][gruppenNr+1];
          const altersKlasse1 = gruppe1.begegnungsRunden[0][0].wettkaempfer1.altersklasse;
          const altersKlasse2 = gruppe2.begegnungsRunden[0][0].wettkaempfer1.altersklasse;
          
          for (let r = 0; r < gruppe1.begegnungsRunden.length; r++) {
            const runde1: Runde = { id:r, runde: r+1, altersklasse: altersKlasse1, gruppe: gruppe1, begegnungen: gruppe1.begegnungsRunden[r]};
            const runde2: Runde = { id:r, runde: r+1, altersklasse: altersKlasse2, gruppe: gruppe2, begegnungen: gruppe2.begegnungsRunden[r]};
            matten[m].runden.push(runde1);
            matten[m].runden.push(runde2);
          }
        }          
      }
      // ungerade Anzahl an Gruppen -> 2 Gruppen je Matte und einmal 3 Gruppen je Matte
      else {
        for (let gruppenNr = 0; gruppenNr < wettkampfGruppenJeMatten[m].length; gruppenNr++) {
          const gruppe = wettkampfGruppenJeMatten[m][gruppenNr];
          for (let r = 0; r < gruppe.begegnungsRunden.length; r++) {
            const begegnungen = gruppe.begegnungsRunden[r];
            const altersKlasse = gruppe.begegnungsRunden[0][0].wettkaempfer1.altersklasse;
            
            const runde: Runde = { id:r, runde: r+1, altersklasse: altersKlasse, gruppe: gruppe, begegnungen: begegnungen};
            matten[m].runden.push(runde);
          }
          console.log("entered loop 1b", gruppenNr, matten[m].runden.reduce((s, w) => w.begegnungen.reduce((s, b) => b.wettkaempfer1.name + "-" + b.wettkaempfer2?.name + ",", ""), ""))
        }
      }
    }
    return matten;
  }

  private getAlgorithmus(ks: Kampfsystem) : Algorithmus {
    switch (ks) {
      case Kampfsystem.pool: 
        return new SechserPool();
      default: 
        return new RoundRobin();
    }
  }

  private splitArray(arr: WettkampfGruppe[], numberOfParts: number): WettkampfGruppe[][] {
    const parts = [];
    const partLength = Math.ceil(arr.length / numberOfParts);
  
    for (let i = 0; i < numberOfParts; i++) {
      const startIndex = i * partLength;
      const endIndex = startIndex + partLength;
      parts.push(arr.slice(startIndex, endIndex));
    }
  
    return parts;
  } 
}