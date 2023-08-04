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

const logger = getLogger('TurnierService');
const einstellungenRepo = new EinstellungenRepository();
const sortierer = new Sortierer();
const ANZAHL_MATTEN = 3;

export class TurnierService {
  
  async speichereTurnierEinstellungen(einstellungen: Einstellungen): Promise<Einstellungen> {
    logger.debug('Speichere Einstellungen');
    await einstellungenRepo.save(einstellungen);
    return einstellungenRepo.load();
  }
  
  async ladeTurnierEinstellungen(): Promise<Einstellungen> {
    logger.debug('Lade Einstellungen');
    return einstellungenRepo.load();
  }

  async erstelleGruppen(gewichtsklassenGruppen: GewichtsklassenGruppe[]): Promise<WettkampfGruppe[]> {
    logger.debug(`Erstelle ${gewichtsklassenGruppen.length} Gruppen...`);
    
    const einstellungen = await einstellungenRepo.load();
    const algorithmus = einstellungen.turnierTyp == TurnierTyp.randori ? new JederGegenJeden() : this.getAlgorithmus(Kampfsystem.ko);
    
    this.berechneGruppenReihenfolge(gewichtsklassenGruppen, algorithmus);

    return [];
  }
  
  berechneGruppenReihenfolge(gewichtsklassenGruppen: GewichtsklassenGruppe[], algorithmus: Algorithmus): Matte[] {
    let matten : Matte[] = [];


    let wettkampfGruppen: WettkampfGruppe[] = [];
    // erstelle alle Begegnungen in jeder Gruppe
    for (let i = 0; i < gewichtsklassenGruppen.length; i++) {
      const gruppe = gewichtsklassenGruppen[i];
      const wkg = algorithmus.erstelleWettkampfGruppen(i, gruppe, ANZAHL_MATTEN);
      wettkampfGruppen.push(...wkg);
    }

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
        console.log("gerade")
        const gruppe1 = wettkampfGruppen[0];
        const gruppe2 = wettkampfGruppen[1];
        
        for (let r = 0; r < gruppe1.begegnungsRunden.length; r++) {
          const runde1: Runde = { runde: r, gruppe: gruppe1, begegnungen: gruppe1.begegnungsRunden[r]};
          const runde2: Runde = { runde: r, gruppe: gruppe2, begegnungen: gruppe2.begegnungsRunden[r]};
          matten[m].runden.push(runde1);
          matten[m].runden.push(runde2);
        }
          
        // was ist, wenn beide Gruppen unterschiedlich viele Begegnungnen haben???
        
      }
      // ungerade Anzahl an Gruppen -> 2 Gruppen je Matte und einmal 3 Gruppen je Matte
      else {
        // todo
        console.log("ungerade", wettkampfGruppen.length)
        const gruppe1 = wettkampfGruppen[0];
        const gruppe2 = wettkampfGruppen[1];
        const gruppe3 = wettkampfGruppen[2];
        
        for (let r = 0; r < gruppe1.begegnungsRunden.length; r++) {
          const runde1: Runde = { runde: r, gruppe: gruppe1, begegnungen: gruppe1.begegnungsRunden[r]};
          const runde2: Runde = { runde: r, gruppe: gruppe2, begegnungen: gruppe2.begegnungsRunden[r]};
          const runde3: Runde = { runde: r, gruppe: gruppe3, begegnungen: gruppe3.begegnungsRunden[r]};
          matten[m].runden.push(runde1);
          matten[m].runden.push(runde2);
          matten[m].runden.push(runde3);
        }
      }

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