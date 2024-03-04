import { GewichtsklassenGruppe } from "../model/gewichtsklassengruppe";
import { Kampfsystem } from "../model/kampfsystem";
import { WettkampfGruppe } from "../model/wettkampfgruppe";
import { RoundRobin } from "./algorithm/round-robin";
import { SechserPool } from "./algorithm/sechser-pool";
import { Algorithmus } from "./algorithmus.interface";
import { getLogger } from './logger';
import { Einstellungen, TurnierTyp, WettkampfReihenfolge } from "../model/einstellungen";
import { EinstellungenRepository } from "../adapter/secondary/einstellungen.repository";
import { JederGegenJeden } from "./algorithm/jeder-gegen-jeden";
import { Matte, Runde, } from "../model/matte";
import { GewichtsklassenGruppeService } from "./gewichtsklassengruppe.service";
import { WettkampfRepository } from "../adapter/secondary/wettkampf.repository";

import DatabasePool from "../config/db.config";
import { Begegnung } from "../model/begegnung";
import { Wertung } from "../model/wertung";
import { Altersklasse } from "../model/altersklasse";
import { Sortierer } from "./sortierer";

const logger = getLogger('TurnierService');
const pool: DatabasePool = new DatabasePool();
const einstellungenRepo = new EinstellungenRepository(pool);
const wettkampfRepo = new WettkampfRepository(pool);
const gewichtsklassenGruppenService = new GewichtsklassenGruppeService();
const sortierer = new Sortierer();

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
    await this.erstelleWettkampfreihenfolgeAltersklasse(undefined);
    return;
  }

  async erstelleWettkampfreihenfolgeAltersklasse(altersKlasse: Altersklasse | undefined): Promise<void> {
    logger.debug(`Erstelle Wettkampfreihenfolge für altersklasse...` + altersKlasse);
    
    const einstellungen = await einstellungenRepo.load();
    const gwks = altersKlasse ? await gewichtsklassenGruppenService.ladeAltersklasse(altersKlasse) : await gewichtsklassenGruppenService.lade();
    if (einstellungen.turnierTyp == TurnierTyp.randori) {
      // check gruppe auf vorhandene Daten
      this.checkGruppenSindValide(gwks);

      const algorithmus = new JederGegenJeden();
      const wettkampfGruppen = await this.erstelleWettkampfgruppen(gwks, algorithmus, einstellungen.mattenAnzahl);
      const matten: Matte[] = await this.erstelleGruppenReihenfolgeRandori(wettkampfGruppen, einstellungen.mattenAnzahl, einstellungen.wettkampfReihenfolge);
    
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

  async loescheWettkampfreihenfolgeAltersklasse(altersKlasse: Altersklasse): Promise<void> {
    logger.debug(`Lösche Wettkampfreihenfolge für altersklasse... ` + altersKlasse);
    await wettkampfRepo.loescheWettkaempfe(altersKlasse);
    return;
  }

  erstelleWettkampfgruppen(gewichtsklassenGruppen: GewichtsklassenGruppe[], algorithmus: Algorithmus, anzahlMatten: number): WettkampfGruppe[] {
    logger.debug("erstelle Wettkampfgruppen aus den Gewichtsklassengruppen");
    // erstelle alle Begegnungen in jeder Gruppe
    let wettkampfGruppen: WettkampfGruppe[] = [];
    for (let i = 0; i < gewichtsklassenGruppen.length; i++) {
      const gruppe = gewichtsklassenGruppen[i];
      const wkg = algorithmus.erstelleWettkampfGruppen(i, gruppe, anzahlMatten);
      wettkampfGruppen.push(...wkg);
    }
    return wettkampfGruppen;
  }
  
  erstelleGruppenReihenfolgeRandori(wettkampfGruppen: WettkampfGruppe[], anzahlMatten: number, reihenfolge: WettkampfReihenfolge): Matte[] {
    logger.debug("erstelle Reihenfolge der Wettkämpfe aus den Wettkmapfgruppen: " + reihenfolge);
    let matten : Matte[] = [];

    // Ausplitten der Begegnungen auf die Matten
    let wettkampfGruppenJeMatten = this.splitArray(wettkampfGruppen, anzahlMatten);

    
    for (let m = 0; m < anzahlMatten; m++) {
      const gruppen = wettkampfGruppenJeMatten[m];
      
      // TODO
      // sortiere die Gruppen, sodass die Gruppen mit wenigen Kämpfen ganz hinten sind, aber die Altersklassen zusammen bleiben
      // gruppen.sort((gs1, gs2) => if (gs2.begegnungsRunden[0][0].wettkaempfer1.altersklasse ) gs2.begegnungsRunden.length - gs1.begegnungsRunden.length);
      // this.logWettkampfGruppen(gruppen)
      let runden: Runde[] = [];
      switch (reihenfolge) {
        case WettkampfReihenfolge.abwechselnd:
          runden = sortierer.erstelleReihenfolgeMitAbwechselndenGruppen(gruppen);
          matten.push({ id: m+1, runden: runden});
          break;
        case WettkampfReihenfolge.alle:
          runden = sortierer.erstelleReihenfolgeMitAllenGruppenJeDurchgang(gruppen);
          matten.push({ id: m+1, runden: runden});
          break;
      }
    }

    const erwartet = wettkampfGruppenJeMatten.reduce(
      (s1, wgm) => s1 + wgm.reduce(
        (s2, gr) => s2 + gr.begegnungsRunden.reduce(
          (s3, br) => s3 + br.length, 0), 0), 0)
    const summe = matten.reduce((s, m) => s + m.runden.reduce((s2, r) => s2 + r.begegnungen.length, 0), 0)
    console.log("erwartet, summe, mattenanzahl", erwartet, summe, matten.length)
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

  private logWettkampfGruppen(gruppe: WettkampfGruppe[]): void {
    
    const groups: any[] = []
    gruppe.map(g => {
      const runden: any[] = [];
      g.begegnungsRunden.map(bArray => {
        bArray.map(b => runden.push({Begegnung: b.wettkaempfer1.name +" VS " + b.wettkaempfer2?.name}))
      });
  
      const w = new Set();
      g.begegnungsRunden.map(ra => ra.map(r => {
        w.add(r.wettkaempfer1.name)
        w.add(r.wettkaempfer2!.name)
      }));
      const n = w.size;
      const erwarteteAnzahl = n*(n-1)*1/2;
      groups.push(
        {
          Name: g.name,
          Typ: g.typ,
          AnzahlKaempfer: n,
          erwarteteWettkaempfe: erwarteteAnzahl,
          Runden: runden
        }
        );
    });
    

    let logmessage: any = {
      AnzahlDerGruppen: gruppe.length,
      AnzahlBegegnungenJeGruppe: gruppe.reduce((s, w) => s + w.begegnungsRunden.length + ",", ""),
      Gruppen: groups
    };

    logger.debug("Inhalt Begegnungsrunden", {data :logmessage});
  }
  
  private checkGruppenSindValide(gruppen: GewichtsklassenGruppe[]): void {
    for (const gruppe of gruppen) {
      if (gruppe.altersKlasse == null) throw new Error("GewichtsklassenGruppe " + gruppe.id + " hat keine Altersklasse.");
      if (gruppe.gruppenGeschlecht == null) throw new Error("GewichtsklassenGruppe " + gruppe.id + " hat kein Geschlecht.");
      for (const teilnehmer of gruppe.teilnehmer) {
        if (teilnehmer.altersklasse == null) throw new Error("Teilnehmer " + teilnehmer.id + " hat keine Altersklasse.");
        if (teilnehmer.geschlecht == null) throw new Error("Teilnehmer " + teilnehmer.id + " hat kein Geschlecht.");
        if (teilnehmer.gewicht == null) throw new Error("Teilnehmer " + teilnehmer.id + " hat kein Gewicht.");
      }
    }
  }
}
