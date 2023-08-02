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

const logger = getLogger('TurnierService');
const einstellungenRepo = new EinstellungenRepository();
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

    let wettkampfGruppen: WettkampfGruppe[] = [];
    for (let i = 0; i < gewichtsklassenGruppen.length; i++) {
      const gruppe = gewichtsklassenGruppen[i];
      const wkg = algorithmus.erstelleWettkampfGruppen(i, gruppe, ANZAHL_MATTEN);
      wettkampfGruppen.push(...wkg);

      break;
    }

    return wettkampfGruppen;
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