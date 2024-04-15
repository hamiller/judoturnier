import { GewichtsklassenGruppeRepository } from "../adapter/secondary/gewichtsklassengruppe.repository";
import { WettkaempferRepository } from "../adapter/secondary/wettkaempfer.repository";
import { getGewichtsklasse } from "../config/gewichtsklassen.config";
import { Gewichtsklasse } from "../model/gewichtsklasse";
import { GewichtsklassenGruppe } from "../model/gewichtsklassengruppe";
import { Wettkaempfer } from "../model/wettkaempfer";
import { getLogger } from './logger';
import { RandoriGruppenName, randomRandoriGruppenNamen, alleGruppenNamen} from "../model/randorigruppenname";
import { Geschlecht } from "../model/geschlecht";
import { Altersklasse, altersklasseSortOrder } from "../model/altersklasse";
import { TurnierTyp } from "../model/einstellungen";
import { EinstellungenRepository } from "../adapter/secondary/einstellungen.repository";
import DatabasePool from "../config/db.config";
import { Farbe } from "../model/farben";

const logger = getLogger('GewichtsklassenGruppeService');
const pool: DatabasePool = new DatabasePool();
const gewichtsklassenGruppeRepo = new GewichtsklassenGruppeRepository(pool);
const einstellungenRepo = new EinstellungenRepository(pool);
const wettkaempferRepo = new WettkaempferRepository(pool);
const TURNIER_VARIABLER_GEWICHTSTEIL: number = 0.2;
const RANDORI_GRUPPEN_GROESSE =  6;

export class GewichtsklassenGruppeService {
  
  async aktualisiere(gruppenTeilnehmer: Map<number, number[]>) {
    logger.debug("Aktualisiere Gewichtsklassenzuordnung...");
    const gewichtsklassenGruppen = await gewichtsklassenGruppeRepo.all();
    const wettkaempfer = await wettkaempferRepo.all();
    
    for (const gewichtsklassenGruppe of gewichtsklassenGruppen) {
      const teilnehmerIds = gruppenTeilnehmer.get(gewichtsklassenGruppe.id!);

      if (!teilnehmerIds) continue;  // benötigt für die leere Gruppe

      const wettkaempferListe = this.getWettkeampferListe(teilnehmerIds, wettkaempfer);
      gewichtsklassenGruppe.teilnehmer = wettkaempferListe;
      gewichtsklassenGruppe.maxGewicht = gewichtsklassenGruppe.teilnehmer.map(k => k.gewicht ? k.gewicht : 0).reduce((g1, g2) => Math.max(g1, g2));
      gewichtsklassenGruppe.minGewicht = gewichtsklassenGruppe.teilnehmer.map(k => k.gewicht ? k.gewicht : 0).reduce((g1, g2) => Math.min(g1, g2));
    }
    
    gewichtsklassenGruppeRepo.saveAll(gewichtsklassenGruppen);
  }
  
  loesche(): Promise<void> {
    return gewichtsklassenGruppeRepo.deleteAll();
  }

  loescheAltersklasse(altersKlasse: Altersklasse): Promise<void> {
    return gewichtsklassenGruppeRepo.deleteByAltersklasse(altersKlasse);
  }
  
  speichere(gewichtsKlassenGruppen: GewichtsklassenGruppe[]): Promise<void> {
    logger.debug("Speichere Gewichtsklassen...");
    return gewichtsklassenGruppeRepo.saveAll(gewichtsKlassenGruppen);
  }

  async lade(): Promise<GewichtsklassenGruppe[]> {
    logger.debug("Lade Gewichtsklassen...");
    return gewichtsklassenGruppeRepo.all()
      .then(gruppen => gruppen.sort((a, b) => {
        if (altersklasseSortOrder[a.altersKlasse] !== altersklasseSortOrder[b.altersKlasse]) {
          return altersklasseSortOrder[a.altersKlasse] - altersklasseSortOrder[b.altersKlasse]; // nach Alter sortieren
          }
          else {
            return a.maxGewicht - b.maxGewicht; // wenn Alter gleich, dann Aufsteigend nach Gewicht sortieren
          }
        }));
  }

  async ladeAltersklasse(altersKlasse: Altersklasse): Promise<GewichtsklassenGruppe[]> {
    logger.debug("Lade Gewichtsklassen...");
    return gewichtsklassenGruppeRepo.all()
    .then(gruppen => gruppen.filter(g => g.altersKlasse == altersKlasse))
    .then(gruppen => gruppen.sort((a, b) => {
      if (altersklasseSortOrder[a.altersKlasse] !== altersklasseSortOrder[b.altersKlasse]) {
        return altersklasseSortOrder[a.altersKlasse] - altersklasseSortOrder[b.altersKlasse]; // nach Alter sortieren
        }
        else {
          return a.maxGewicht - b.maxGewicht; // wenn Alter gleich, dann Aufsteigend nach Gewicht sortieren
        }
      }));
  }  
  
  async teileInGewichtsklassen(wettkaempferListe: Wettkaempfer[]): Promise<GewichtsklassenGruppe[]> {
    logger.debug("Erstelle Gewichtsklassen...");
    const einstellungen = await einstellungenRepo.load();
    
    // erstelle die GewichtsklassenGruppen
    let result: GewichtsklassenGruppe[] = [];    

    if (einstellungen.turnierTyp == TurnierTyp.randori) {
      logger.info(`Randori-Turnier`);
      logger.debug("Bei einem Randori-Turnier wird nicht nach geschlecht unterschieden, es wird daher keine Einteilung vorgenommen");
      const wettkaempferNachAlter = this.gruppiereNachAlterklasse(wettkaempferListe);

      // erstelle random Namen für die Gruppen
      let gruppenNamen = alleGruppenNamen();

      for (const wks of wettkaempferNachAlter) {
        const aktuelleGruppenNamen = gruppenNamen.slice(0,  Math.ceil(wks.length / RANDORI_GRUPPEN_GROESSE) +1); // wir brauchen einen Namen mehr um eine leere Gruppe erstellen zu können
        gruppenNamen = gruppenNamen.slice(Math.ceil(wks.length / RANDORI_GRUPPEN_GROESSE));
        result = result.concat(this.erstelleGewichtsklassenGruppenRandori(wks, aktuelleGruppenNamen));
      } 
    }
    else {
      logger.info(`Normales-Turnier`);
      const gruppenNachGeschlecht: Wettkaempfer[][] = this.gruppiereNachGeschlecht(wettkaempferListe);
      const gruppenNachGeschlechtUndAlter: Wettkaempfer[][][] = [];
      for (const g of gruppenNachGeschlecht) {
        const gruppenNachAlter = this.gruppiereNachAlterklasse(g);
        gruppenNachGeschlechtUndAlter.push(gruppenNachAlter);
      }
      result = gruppenNachGeschlechtUndAlter.flatMap(gs => gs.flatMap(g => this.erstelleGewichtsklassenGruppen(g)));
    }

    return result;
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
      const geschlechtZugehoerig = kaempferListe.filter(k => k.geschlecht == geschlecht);
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
      if (gewichtsklassenGruppe.length == 0) {
        logger.info("Skipping group", {data: gewichtsklasse});
        continue; // might happen for the empty groups...
      }
      const maxGewicht = gewichtsklassenGruppe.map(k => k.gewicht ? k.gewicht : 0).reduce((g1, g2) => Math.max(g1, g2));
      const minGewicht = gewichtsklassenGruppe.map(k => k.gewicht ? k.gewicht : 0).reduce((g1, g2) => Math.min(g1, g2));
      const geschlecht = gewichtsklassenGruppe[0].geschlecht; // alle Mitglieder der Gruppe haben das gleiche Geschlecht, da sie vorher so sortiert wurden
      const altersKlasse = gewichtsklassenGruppe[0].altersklasse; // alle Mitglieder der Gruppe haben das gleiche Alter, da sie vorher so sortiert wurden
      gewichtsklassenGruppen.push({
        altersKlasse: altersKlasse,
        gruppenGeschlecht: geschlecht,
        teilnehmer: gewichtsklassenGruppe,
        maxGewicht: maxGewicht,
        minGewicht: minGewicht,
        name: "-"
      });
    }

    return gewichtsklassenGruppen;
  }

  private erstelleGewichtsklassenGruppenRandori(kaempferListe: Wettkaempfer[], gruppenNamen: RandoriGruppenName[]): GewichtsklassenGruppe[] {
    const gewichtsklassenGruppen: GewichtsklassenGruppe[] = [];
    const anzahlRandoriGruppen = Math.ceil(kaempferListe.length / RANDORI_GRUPPEN_GROESSE);   // Wir haben immer 6er Pools im Wettkampf
    logger.info(`erstelle ${anzahlRandoriGruppen} Gruppen...`);
    const wettkaempferGruppen: Wettkaempfer[][] = this.randoriKlassen(kaempferListe, RANDORI_GRUPPEN_GROESSE);
    
    for (let current: number = 0; current < anzahlRandoriGruppen; current++) {
      const gewichtsklassenGruppe = wettkaempferGruppen[current];
      const altersKlasse = gewichtsklassenGruppe[0].altersklasse; // alle Mitglieder der Gruppe haben das gleiche Alter, da sie vorher so sortiert wurden
      const randoriGruppe = gruppenNamen[current].toString();
      const maxGewicht = gewichtsklassenGruppe.map(k => k.gewicht ? k.gewicht : 0).reduce((g1, g2) => Math.max(g1, g2));
      const minGewicht = gewichtsklassenGruppe.map(k => k.gewicht ? k.gewicht : 0).reduce((g1, g2) => Math.min(g1, g2));

      gewichtsklassenGruppen.push({
        altersKlasse: altersKlasse,
        gruppenGeschlecht: Geschlecht.w, // bei Randori-Turnieren spielt das Geschlecht keine Rolle
        teilnehmer: gewichtsklassenGruppe,
        maxGewicht: maxGewicht,
        minGewicht: minGewicht,
        name: randoriGruppe
      });
    }

    // erstelle leere Gruppe in dieser Altersklasse
    const randoriGruppe = gruppenNamen[anzahlRandoriGruppen].toString();
    gewichtsklassenGruppen.push({
      altersKlasse: wettkaempferGruppen[0][0].altersklasse,
      gruppenGeschlecht: Geschlecht.w,
      teilnehmer: [],
      maxGewicht: 100,
      minGewicht: 0,
      name: randoriGruppe
    });

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
    throw new Error("Unbekannte Gewichtsklasse:" + wettkaempfer.gewicht);
  }

  private randoriKlassen(wettkaempfer: Wettkaempfer[], gruppenGroesse: number): Wettkaempfer[][] {
    // Sortiere die Wettkämpfer nach ihrem Gewicht aufsteigend
    wettkaempfer.sort((a, b) => a.gewicht! - b.gewicht!);
  
    const gruppen: Wettkaempfer[][] = [];
    let aktuelleGruppe: Wettkaempfer[] = [];
  
    for (let i = 0; i < wettkaempfer.length; i++) {
      const wettkaempferInGruppe = aktuelleGruppe.length;
  
      if (wettkaempferInGruppe === 0 || wettkaempferInGruppe < gruppenGroesse) {
        // Füge den Wettkämpfer zur aktuellen Gruppe hinzu
        aktuelleGruppe.push(wettkaempfer[i]);
      } else {
        // Erstelle eine neue Gruppe und füge den Wettkämpfer hinzu
        gruppen.push(aktuelleGruppe);
        aktuelleGruppe = [wettkaempfer[i]];
      }
      wettkaempfer[i].farbe = this.getFarbe(aktuelleGruppe.length);
      wettkaempferRepo.save(wettkaempfer[i]);
    }
  
    // Füge die letzte Gruppe hinzu, falls sie nicht vollständig ist
    if (aktuelleGruppe.length > 0) {
      gruppen.push(aktuelleGruppe);
    }
  
    return gruppen;
  }

  private getFarbe(index: number): Farbe {
    const farben = Object.values(Farbe);
    return farben[--index];
  }
}