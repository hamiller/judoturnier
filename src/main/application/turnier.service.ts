import { Begegnung } from "../model/begegnung";
import { GewichtsklassenGruppe } from "../model/gewichtsklassengruppe";
import { Kampfsystem } from "../model/kampfsystem";
import { WettkampfGruppe } from "../model/wettkampfgruppe";
import { RoundRobin } from "./algorithm/round-robin";
import { SechserPool } from "./algorithm/sechser-pool";
import { Algorithmus } from "./algorithmus.interface";
import { getLogger } from './logger';
import { Einstellungen, TurnierTyp } from "../model/einstellungen";
import { EinstellungenRepository } from "../adapter/secondary/einstellungen.repository";

const logger = getLogger('TurnierService');
const einstellungenRepo = new EinstellungenRepository();
const ANZAHL_MATTEN = 3;
const KAMPFPAUSEN = 2;

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
    const algorithmus = einstellungen.turnierTyp == TurnierTyp.randori ? new SechserPool() : this.getAlgorithmus(Kampfsystem.ko);

    let wettkampfGruppen: WettkampfGruppe[] = [];
    for (let i = 0; i < gewichtsklassenGruppen.length; i++) {
      const gruppe = gewichtsklassenGruppen[i];
      const wkg = algorithmus.erstelleWettkampfGruppen(i, gruppe, ANZAHL_MATTEN);
      wettkampfGruppen.push(...wkg);

      break;
    }
    wettkampfGruppen = this.sortiereGruppen(wettkampfGruppen, KAMPFPAUSEN);

    return wettkampfGruppen;
  }

  sortiereGruppen(wettkampfGruppen: WettkampfGruppe[], KAMPFPAUSEN: number): WettkampfGruppe[] {
    logger.debug("Sortiere Begegnungen in den Kampfgruppen");
    return wettkampfGruppen;
  }

  private getAlgorithmus(ks: Kampfsystem) : Algorithmus {
    switch (ks) {
      default:
        return new RoundRobin();
    }
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