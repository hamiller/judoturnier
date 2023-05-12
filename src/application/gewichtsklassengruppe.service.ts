import { GewichtsklassenGruppeRepository } from "../adapter/secondary/gewichtsklassengruppe.repository";
import { WettkaempferRepository } from "../adapter/secondary/wettkaempfer.repository";
import { getGewichtsklasse } from "../config/gewichtsklassen.config";
import { Gewichtsklasse } from "../model/gewichtsklasse";
import { GewichtsklassenGruppe } from "../model/gewichtsklassengruppe";
import { Wettkaempfer } from "../model/wettkaempfer";
import { getLogger } from './logger';

const logger = getLogger('GewichtsklassenGruppeService');
const gewichtsklassenGruppeRepo = new GewichtsklassenGruppeRepository();
const wettkaempferRepo = new WettkaempferRepository();
const VARIABLER_GEWICHTSTEIL: number = 0.2;

export class GewichtsklassenGruppeService {
  
  async aktualisiere(gruppenTeilnehmer: Map<number, number[]>) {
    logger.debug("Aktualisieren...");
    const gewichtsklassenGruppen = await gewichtsklassenGruppeRepo.all();
    const wettkaempfer = await wettkaempferRepo.all();
    
    for (const gewichtsklassenGruppe of gewichtsklassenGruppen) {
      const teilnehmerIds = gruppenTeilnehmer.get(gewichtsklassenGruppe.id!);
      const wettkaempferListe = this.getWettkeampferListe(teilnehmerIds, wettkaempfer);
      gewichtsklassenGruppe.teilnehmer = wettkaempferListe;
    }
    
    gewichtsklassenGruppeRepo.saveAll(gewichtsklassenGruppen);
  }
  
  loesche(): Promise<void> {
    return gewichtsklassenGruppeRepo.deleteAll();
  }

  speichere(gewichtsKlassenGruppen: GewichtsklassenGruppe[]): Promise<void> {
    logger.debug("Speichere Gewichtsklassen...");
    return gewichtsklassenGruppeRepo.saveAll(gewichtsKlassenGruppen);
  }

  lade(): Promise<GewichtsklassenGruppe[]> {
    logger.debug("Lade Gewichtsklassen...");
    return gewichtsklassenGruppeRepo.all();
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

  private getWettkeampferListe(teilnehmerIds: number[] | undefined, wettkaempfer: Wettkaempfer[]) {
    if (!teilnehmerIds) return [];

    const wettkaempferListe: Wettkaempfer[] = []; 
    for (const id of teilnehmerIds) {
      for (const w of wettkaempfer) {
        if (id == w.id) wettkaempferListe.push(w);
      }
    }
    return wettkaempferListe;
  }

  private getGruppe(gruppenId: number, gewichtsklassenGruppen: GewichtsklassenGruppe[]) {
    for (const gewichtsklassenGruppe of gewichtsklassenGruppen) {
      if (gewichtsklassenGruppe.id == gruppenId) return gewichtsklassenGruppe;
    }

    throw new Error("Unbekannt Gruppen-ID:" + gruppenId);
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

}