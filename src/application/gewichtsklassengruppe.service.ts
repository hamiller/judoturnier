import { GewichtsklassenGruppeRepository } from "../adapter/secondary/gewichtsklassengruppe.repository";
import { getGewichtsklasse } from "../config/gewichtsklassen.config";
import { Begegnung } from "../model/begegnung";
import { Gewichtsklasse } from "../model/gewichtsklasse";
import { GewichtsklassenGruppe } from "../model/gewichtsklassengruppe";
import { Kampfsystem } from "../model/kampfsystem";
import { Wettkaempfer } from "../model/wettkaempfer";
import { RoundRobin } from "./algorithm/round-robin";
import { SechserPool } from "./algorithm/sechser-pool";
import { Algorithmus } from "./algorithmus.interface";
import { getLogger } from './logger';

const logger = getLogger('GewichtsklassenGruppeService');
const repo = new GewichtsklassenGruppeRepository();
const VARIABLER_GEWICHTSTEIL: number = 0.2;

export class GewichtsklassenGruppeService {
  speichere(gewichtsKlassenGruppen: GewichtsklassenGruppe[]): Promise<Number> {
    return repo.saveAll(gewichtsKlassenGruppen);
  }

  teileInGewichtsklassen(wettkaempferListe: Wettkaempfer[]): GewichtsklassenGruppe[] {
    logger.debug("Erstelle Gewichtsklassen...");
    const gruppenNachGeschlecht: Wettkaempfer[][] = this.gruppiereNachGeschlecht(wettkaempferListe);
    const gruppenNachGeschlechtUndAlter: Wettkaempfer[][][] = [];
    for (const g of gruppenNachGeschlecht) {
      const gruppenNachAlter = this.gruppiereNachAlterklasse(g);
      gruppenNachGeschlechtUndAlter.push(gruppenNachAlter);
    }
    const gruppen = gruppenNachGeschlechtUndAlter.flatMap(gs => gs.flatMap(g => this.erstelleGewichtsklassenGruppen(g)))
    return gruppen;
  }

  private gruppiereNachGeschlecht(kaempferListe: Wettkaempfer[]): Wettkaempfer[][] {
    const geschlechter = new Set(kaempferListe.map(k => k.geschlecht));
    const geschlechtZugehoerige: Wettkaempfer[][] = [];
    for (const geschlecht of geschlechter) {
      const geschlechtZugehoerig = kaempferListe.filter(k => k.geschlecht == geschlecht)
      geschlechtZugehoerige.push(geschlechtZugehoerig);
    }
    return geschlechtZugehoerige;
  }

  private gruppiereNachAlterklasse(kaempferListe: Wettkaempfer[]): Wettkaempfer[][] {
    const altersKlassen = new Set(kaempferListe.map(k => k.altersklasse));
    const altersKlassenMitgliederGruppe: Wettkaempfer[][] = [];
    for (const altersKlasse of altersKlassen) {
      const altersKlassenMitglieder = kaempferListe.filter(k => k.altersklasse == altersKlasse);
      altersKlassenMitgliederGruppe.push(altersKlassenMitglieder);
    }
    return altersKlassenMitgliederGruppe;
  }

  private erstelleGewichtsklassenGruppen(kaempferListe: Wettkaempfer[]): GewichtsklassenGruppe[] {
    const gewichtsklassen = new Set(kaempferListe.map(k => this.gewichtsKlasse(k)));
    const gewichtsklassenGruppen: GewichtsklassenGruppe[] = [];
    for (const gewichtsklasse of gewichtsklassen) {
      const gewichtsklassenGruppe: Wettkaempfer[] = kaempferListe.filter(k => this.gewichtsKlasse(k) == gewichtsklasse);
      const geschlecht = gewichtsklassenGruppe[0].geschlecht; // alle Mitglieder der Gruppe haben das gleiche Geschlecht, da sie vorher so sortiert wurden
      const altersKlasse = gewichtsklassenGruppe[0].altersklasse; // alle Mitglieder der Gruppe haben das gleiche Alter, da sie vorher so sortiert wurden
      gewichtsklassenGruppen.push({
        altersKlasse: altersKlasse,
        gruppenGeschlecht: geschlecht,
        teilnehmer: gewichtsklassenGruppe,
        gewichtsklasse: gewichtsklasse,
        name: "Irgendwas"
      });
    }

    return gewichtsklassenGruppen;
  }

  private gewichtsKlasse(wettkaempfer: Wettkaempfer): Gewichtsklasse {
    if (!wettkaempfer.gewicht) {
      return { name: "Ohne", gewicht: 0 };
    }
    const gewichtsklassen: Gewichtsklasse[] = getGewichtsklasse(wettkaempfer.geschlecht, wettkaempfer.altersklasse);
    for (const gewichtsklasse of gewichtsklassen) {
      if (wettkaempfer.gewicht <= gewichtsklasse.gewicht + VARIABLER_GEWICHTSTEIL) {
        return gewichtsklasse;
      }
    }
    // hier sollten wir nie hinkommen
    throw new Error("Unbekanntes Gewicht:" + wettkaempfer.gewicht);
  }

  private getAlgorithmus(ks: Kampfsystem) : Algorithmus {
    switch (ks) {
      case Kampfsystem.pool6:
        return new SechserPool();
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