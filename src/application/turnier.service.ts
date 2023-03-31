import { Altersklasse } from "../model/altersklasse";
import { Geschlecht } from "../model/geschlecht";
import { Wettkaempfer } from "../model/wettkaempfer";
import { WettkampfGruppe } from "../model/wettkampfgruppe";
import { GewichtsklassenGruppe } from "../model/gewichtsklassengruppe";
import { getLogger } from './logger';
import { RoundRobin } from "./round-robin";
import { getGewichte } from "../config/gewichtsklassen.config";

const logger = getLogger('TurnierService');
const algorithmus = new RoundRobin();

const VARIABLER_GEWICHTSTEIL: number = 0.2;

export class TurnierService {

  erstelleGruppen(wettkaempferListe: Wettkaempfer[]): WettkampfGruppe[] {
    logger.debug("Erstelle Gruppen...");
    // dummy
    let u11W = this.sortiere(wettkaempferListe, Geschlecht.w, Altersklasse.U11);
    return [];
  }

  teileInGewichtsklassen(wettkaempferListe: Wettkaempfer[]): GewichtsklassenGruppe[] {
    const gruppenNachGeschlecht: Wettkaempfer[][] = this.gruppiereNachGeschlecht(wettkaempferListe);
    const gruppenNachGeschlechtUndAlter: Wettkaempfer[][][] = [];
    for (const g of gruppenNachGeschlecht) {
      const gruppenNachAlter = this.gruppiereNachAlterklasse(g);
      gruppenNachGeschlechtUndAlter.push(gruppenNachAlter);
    }    
    const gruppen = gruppenNachGeschlechtUndAlter.flatMap(gs => gs.flatMap(g => this.erstelleGewichtsklassenGruppen(g)))
    return gruppen;
  }

  
  private sortiere(liste: Wettkaempfer[], geschlecht: Geschlecht, altersklasse: Altersklasse): Wettkaempfer[] {
    return liste
      .filter(wk => { return wk.geschlecht === geschlecht && wk.altersklasse === altersklasse})
      .sort((a,b) => {
        if (a.gewicht) {
          if (b.gewicht) {
            return a.gewicht - b.gewicht
          }
          return 1;
        }
        if (b.gewicht) {
          return -1;
        }
        return 0;
      });
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
    for (const altersKlasse of altersKlassen){
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
        gewichtsklasse: {}, 
        name: gewichtsklasse.toString()});
      console.log("gw:", gewichtsklasse);
    }

    return gewichtsklassenGruppen;
  }

  private gewichtsKlasse(wettkaempfer: Wettkaempfer): number {
    if (!wettkaempfer.gewicht) {
      return 0;
    }

    const gewichte: number[] = getGewichte(wettkaempfer.geschlecht, wettkaempfer.altersklasse);
    for (const grenzGewicht of gewichte) {
      if (wettkaempfer.gewicht <= grenzGewicht + VARIABLER_GEWICHTSTEIL) {
        return grenzGewicht;
      }
    }
    // hier sollten wir nie hinkommen
    throw new Error("Unbekanntes Gewicht:" + wettkaempfer.gewicht);
  }
}