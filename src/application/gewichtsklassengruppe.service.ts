import { GewichtsklassenGruppeRepository } from "../adapter/secondary/gewichtsklassengruppe.repository";
import { WettkaempferRepository } from "../adapter/secondary/wettkaempfer.repository";
import { getGewichtsklasse } from "../config/gewichtsklassen.config";
import { Gewichtsklasse } from "../model/gewichtsklasse";
import { GewichtsklassenGruppe } from "../model/gewichtsklassengruppe";
import { Wettkaempfer } from "../model/wettkaempfer";
import { getLogger } from './logger';
import { randoriTurnier } from "../config/app.config";
import { randomRandoriGruppenNamen} from "../model/randorigruppenname";
import { Geschlecht } from "../model/geschlecht";
import { altersklasseSortOrder } from "../model/altersklasse";

const logger = getLogger('GewichtsklassenGruppeService');
const gewichtsklassenGruppeRepo = new GewichtsklassenGruppeRepository();
const wettkaempferRepo = new WettkaempferRepository();
const TURNIER_VARIABLER_GEWICHTSTEIL: number = 0.2;
const RANDORI_GRUPPEN_GROESSE =  6;

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
    return gewichtsklassenGruppeRepo.all()
      .then(gruppen => gruppen.sort((a, b) => {
        if (altersklasseSortOrder[a.altersKlasse] !== altersklasseSortOrder[b.altersKlasse]) {
          return altersklasseSortOrder[a.altersKlasse] - altersklasseSortOrder[b.altersKlasse]; // nach Alter sortieren
        }
        else {
          return a.gewichtsklasse.gewicht - b.gewichtsklasse.gewicht; // wenn Alter gleich, dann Aufsteigend nach Gewicht sortieren
        }
      }));
  }

  teileInGewichtsklassen(wettkaempferListe: Wettkaempfer[]): GewichtsklassenGruppe[] {
    logger.debug("Erstelle Gewichtsklassen...");
    
    if (randoriTurnier) {
      logger.info(`Randori-Turnier: ${randoriTurnier}`);
      logger.debug("Bei einem Randori-Turnier wird nicht nach geschlecht unterschieden, es wird daher keine Einteilung vorgenommen");
      const gruppenNachAlter = this.gruppiereNachAlterklasse(wettkaempferListe);
      return gruppenNachAlter.flatMap(gs => this.erstelleGewichtsklassenGruppenRandori(gs));
    }
    
    logger.info(`Normales-Turnier`);
    const gruppenNachGeschlecht: Wettkaempfer[][] = this.gruppiereNachGeschlecht(wettkaempferListe);
    const gruppenNachGeschlechtUndAlter: Wettkaempfer[][][] = [];
    for (const g of gruppenNachGeschlecht) {
      const gruppenNachAlter = this.gruppiereNachAlterklasse(g);
      gruppenNachGeschlechtUndAlter.push(gruppenNachAlter);
    }
    const gruppen = gruppenNachGeschlechtUndAlter.flatMap(gs => gs.flatMap(g => this.erstelleGewichtsklassenGruppen(g)));
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
  
  private gruppiereNachGeschlecht(kaempferListe: Wettkaempfer[]): Wettkaempfer[][] {
    const geschlechtZugehoerige: Wettkaempfer[][] = [];
    const geschlechter = new Set(kaempferListe.map(k => k.geschlecht));
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
        name: "-"
      });
    }

    return gewichtsklassenGruppen;
  }

  private erstelleGewichtsklassenGruppenRandori(kaempferListe: Wettkaempfer[]): GewichtsklassenGruppe[] {
    const gewichtsklassenGruppen: GewichtsklassenGruppe[] = [];
    const anzahlRandoriGruppen = Math.ceil(kaempferListe.length / RANDORI_GRUPPEN_GROESSE);   // Wir haben immer 6er Pools im Wettkampf
    logger.info(`erstelle ${anzahlRandoriGruppen} Gruppen...`);
    const randoriGruppen = randomRandoriGruppenNamen(anzahlRandoriGruppen);
    const wettkaempferGruppen: Wettkaempfer[][] = this.randoriKlassen(kaempferListe, RANDORI_GRUPPEN_GROESSE);
    
    for (let current: number = 0; current < anzahlRandoriGruppen; current++) {
      const gewichtsklassenGruppe = wettkaempferGruppen[current];
      const altersKlasse = gewichtsklassenGruppe[0].altersklasse; // alle Mitglieder der Gruppe haben das gleiche Alter, da sie vorher so sortiert wurden
      const randoriGruppe = randoriGruppen[current].toString();
      const leichtestesGruppenGewicht = gewichtsklassenGruppe[0].gewicht!
      const hoechstesGruppenGewicht = gewichtsklassenGruppe[gewichtsklassenGruppe.length -1].gewicht!
      
      gewichtsklassenGruppen.push({
        altersKlasse: altersKlasse,
        gruppenGeschlecht: Geschlecht.w, // bei Randori-Turnieren spielt das Geschlecht keine Rolle
        teilnehmer: gewichtsklassenGruppe,
        gewichtsklasse: { name: `${leichtestesGruppenGewicht}kg - ${hoechstesGruppenGewicht}kg`, gewicht: leichtestesGruppenGewicht },  // wir nehmen stellvertretend für die Gruppe das Gewicht des ersten Teilnehmers
        name: randoriGruppe
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
      if (wettkaempfer.gewicht <= gewichtsklasse.gewicht + TURNIER_VARIABLER_GEWICHTSTEIL) {
        return gewichtsklasse;
      }
    }
    // hier sollten wir nie hinkommen
    throw new Error("Unbekanntes Gewicht:" + wettkaempfer.gewicht);
  }

  private randoriKlassen(wettkaempfer: Wettkaempfer[], gruppenGroesse: number): Wettkaempfer[][] {
    // Sortiere die Wettkämpfer nach ihrem Gewicht aufsteigend
    wettkaempfer.sort((a, b) => a.gewicht! - b.gewicht!);
  
    const gruppen: Wettkaempfer[][] = [];
    let aktuelleGruppe: Wettkaempfer[] = [];
  
    for (let i = 0; i < wettkaempfer.length; i++) {
      const wettkämpferInGruppe = aktuelleGruppe.length;
  
      if (wettkämpferInGruppe === 0 || wettkämpferInGruppe < gruppenGroesse) {
        // Füge den Wettkämpfer zur aktuellen Gruppe hinzu
        aktuelleGruppe.push(wettkaempfer[i]);
      } else {
        // Erstelle eine neue Gruppe und füge den Wettkämpfer hinzu
        gruppen.push(aktuelleGruppe);
        aktuelleGruppe = [wettkaempfer[i]];
      }
    }
  
    // Füge die letzte Gruppe hinzu, falls sie nicht vollständig ist
    if (aktuelleGruppe.length > 0) {
      gruppen.push(aktuelleGruppe);
    }
  
    return gruppen;
  }
}