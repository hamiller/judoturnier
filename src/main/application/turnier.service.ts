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
import { Sortierer } from "./sortierer";
import { Matte, Runde } from "../model/matte";
import { GewichtsklassenGruppeService } from "./gewichtsklassengruppe.service";
import { WettkampfRepository } from "../adapter/secondary/wettkampf.repository";

import DatabasePool from "../config/db.config";
import { Begegnung } from "../model/begegnung";
import { RandoriWertung } from "../model/wertung";

const logger = getLogger('TurnierService');
const pool: DatabasePool = new DatabasePool();
const einstellungenRepo = new EinstellungenRepository(pool);
const wettkampfRepo = new WettkampfRepository(pool);
const gewichtsklassenGruppenService = new GewichtsklassenGruppeService();
const sortierer = new Sortierer();
const ANZAHL_MATTEN = 3;

export class TurnierService {
  async isRandori(): Promise<boolean> {
    return await einstellungenRepo.load().then((einstellung) => einstellung.turnierTyp == TurnierTyp.randori).catch(() => {throw new Error("Turniertyp nicht gefunden")});
  }
  
  async ladeWertungFuerWettkampf(wettkampfId: number): Promise<Begegnung> {
    return wettkampfRepo.ladeWertung(wettkampfId);
  }

  async speichereRandoriWertung(wertung: RandoriWertung): Promise<void> {
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
    // return wettkampfRepo.ladeMatten();
    return this.erstelleWettkampfreihenfolge();
  }

  async erstelleWettkampfreihenfolge(): Promise<Matte[]> {
    logger.debug(`Erstelle Wettkampfreihenfolge...`);
    
    const einstellungen = await einstellungenRepo.load();
    const gwks = await gewichtsklassenGruppenService.lade();
    if (einstellungen.turnierTyp == TurnierTyp.randori) {
      const algorithmus = new JederGegenJeden();
      const matten: Matte[] = await this.berechneGruppenReihenfolgeRandori(gwks, algorithmus);
    
      await wettkampfRepo.speichereMatten(matten);
      return matten;
    }
    else {
      const algorithmus = this.getAlgorithmus(Kampfsystem.ko);
      logger.error(`Turniermodus noch nicht implementiert!`);
    }
    
    return [];
  }
  
  berechneGruppenReihenfolgeRandori(gewichtsklassenGruppen: GewichtsklassenGruppe[], algorithmus: Algorithmus): Matte[] {
    logger.warn("Unvollständig!")
    // TODO:
    // korrektes iterieren über einzelne Gruppen!!!!


    let matten : Matte[] = [];

    let wettkampfGruppen: WettkampfGruppe[] = [];
    // erstelle alle Begegnungen in jeder Gruppe
    for (let i = 0; i < gewichtsklassenGruppen.length; i++) {
      const gruppe = gewichtsklassenGruppen[i];
      const wkg = algorithmus.erstelleWettkampfGruppen(i, gruppe, ANZAHL_MATTEN);
      wettkampfGruppen.push(...wkg);
    }

    console.log("--------------------")

    // jetzt haben wir den Aufbau "Wettkampf[Gruppe][Runde][Begegnungen]"
    /*
      Wettkampf[Gruppe][Runde][Begegnungen]:

      Wettkampf[Gruppe_Tiger][Runde_1][Begegnung_1]: Teilnehmer A=>Teilnehmer F
      Wettkampf[Gruppe_Tiger][Runde_1][Begegnung_2]: Teilnehmer B=>Teilnehmer E
      Wettkampf[Gruppe_Tiger][Runde_1][Begegnung_3]: Teilnehmer C=>Teilnehmer D
      Wettkampf[Gruppe_Tiger][Runde_2][Begegnung_1]: Teilnehmer F=>Teilnehmer D
      Wettkampf[Gruppe_Tiger][Runde_2][Begegnung_2]: Teilnehmer E=>Teilnehmer C
      Wettkampf[Gruppe_Tiger][Runde_2][Begegnung_3]: Teilnehmer A=>Teilnehmer B
      ...
      Wettkampf[Gruppe_Katze][Runde_1][Begegnung_1]: Teilnehmer G=>Teilnehmer L
      Wettkampf[Gruppe_Katze][Runde_1][Begegnung_2]: Teilnehmer H=>Teilnehmer K
      Wettkampf[Gruppe_Katze][Runde_1][Begegnung_3]: Teilnehmer I=>Teilnehmer J
      Wettkampf[Gruppe_Katze][Runde_2][Begegnung_1]: Teilnehmer L=>Teilnehmer J
      Wettkampf[Gruppe_Katze][Runde_2][Begegnung_2]: Teilnehmer K=>Teilnehmer I
      Wettkampf[Gruppe_Katze][Runde_2][Begegnung_3]: Teilnehmer G=>Teilnehmer H
      ...
    */


    // mische die Gruppen, sodass nach jeder Runde eine andere Gruppe an der Reihe ist und kein Teilnehmer 2mal hintereinander antritt
    /*
      Wettkampf[Runde][Begegnungen]:

      Wettkampf[Gruppe_Tiger][Runde_1][Begegnung_1]: Teilnehmer A=>Teilnehmer F
      Wettkampf[Gruppe_Tiger][Runde_1][Begegnung_2]: Teilnehmer B=>Teilnehmer E
      Wettkampf[Gruppe_Tiger][Runde_1][Begegnung_3]: Teilnehmer C=>Teilnehmer D
      Wettkampf[Gruppe_Tiger][Runde_2][Begegnung_1]: Teilnehmer F=>Teilnehmer D
      Wettkampf[Gruppe_Tiger][Runde_2][Begegnung_2]: Teilnehmer E=>Teilnehmer C
      Wettkampf[Gruppe_Tiger][Runde_2][Begegnung_3]: Teilnehmer A=>Teilnehmer B
      ...
      Wettkampf[Gruppe_Katze][Runde_1][Begegnung_1]: Teilnehmer G=>Teilnehmer L
      Wettkampf[Gruppe_Katze][Runde_1][Begegnung_2]: Teilnehmer H=>Teilnehmer K
      Wettkampf[Gruppe_Katze][Runde_1][Begegnung_3]: Teilnehmer I=>Teilnehmer J
      Wettkampf[Gruppe_Katze][Runde_2][Begegnung_1]: Teilnehmer L=>Teilnehmer J
      Wettkampf[Gruppe_Katze][Runde_2][Begegnung_2]: Teilnehmer K=>Teilnehmer I
      Wettkampf[Gruppe_Katze][Runde_2][Begegnung_3]: Teilnehmer G=>Teilnehmer H
      ...
    */

    for (let m = 0; m < ANZAHL_MATTEN; m++) {
      matten.push({ id: m+1, runden: []});

      // gerade Anzahl an Gruppen -> 2 Gruppen je Matte
      if (wettkampfGruppen.length % 2 == 0) {
        console.log("gerade Gruppenanzahl:", wettkampfGruppen.length)
        const gruppe1 = wettkampfGruppen[0];
        const gruppe2 = wettkampfGruppen[1];
        
        for (let r = 0; r < gruppe1.begegnungsRunden.length; r++) {
          const runde1: Runde = { id:r, runde: r+1, gruppe: gruppe1, begegnungen: gruppe1.begegnungsRunden[r]};
          const runde2: Runde = { id:r, runde: r+1, gruppe: gruppe2, begegnungen: gruppe2.begegnungsRunden[r]};
          matten[m].runden.push(runde1);
          matten[m].runden.push(runde2);
        }
          
        // was ist, wenn beide Gruppen unterschiedlich viele Begegnungnen haben???
        
      }
      // ungerade Anzahl an Gruppen -> 2 Gruppen je Matte und einmal 3 Gruppen je Matte
      else {
        console.log("ungerade Gruppenanzahl:", wettkampfGruppen.length)
        for (let gruppenNr = 0; gruppenNr < wettkampfGruppen.length; gruppenNr++) {
          console.log("Gruppe ", gruppenNr);

          const gruppe = wettkampfGruppen[gruppenNr];
          for (let r = 0; r < gruppe.begegnungsRunden.length; r++) {
            const begegnungen = gruppe.begegnungsRunden[r];
          
            console.log("Begegnungen in Runde: ", r, begegnungen)
          
            const runde: Runde = { id:r, runde: r+1, gruppe: gruppe, begegnungen: begegnungen};
            matten[m].runden.push(runde);
          }
          break;
        }
      }

      console.log("break")
      break;
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

}