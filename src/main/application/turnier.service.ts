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
import { Matte, Runde } from "../model/matte";
import { GewichtsklassenGruppeService } from "./gewichtsklassengruppe.service";
import { WettkampfRepository } from "../adapter/secondary/wettkampf.repository";

import DatabasePool from "../config/db.config";
import { Begegnung } from "../model/begegnung";
import { Wertung } from "../model/wertung";
import { Altersklasse } from "../model/altersklasse";

const logger = getLogger('TurnierService');
const pool: DatabasePool = new DatabasePool();
const einstellungenRepo = new EinstellungenRepository(pool);
const wettkampfRepo = new WettkampfRepository(pool);
const gewichtsklassenGruppenService = new GewichtsklassenGruppeService();

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
    logger.debug(`Erstelle Wettkampfreihenfolge...`);
    
    const einstellungen = await einstellungenRepo.load();
    const gwks = await gewichtsklassenGruppenService.lade();
    if (einstellungen.turnierTyp == TurnierTyp.randori) {
      const algorithmus = new JederGegenJeden();
      const wettkampfGruppen = await this.erstelleWettkampfgruppen(gwks, algorithmus, einstellungen.mattenAnzahl);
      const matten: Matte[] = await this.erstelleGruppenReihenfolgeRandori(wettkampfGruppen, einstellungen.mattenAnzahl);
    
      await wettkampfRepo.speichereMatten(matten);
      return;
    }
    else {
      const algorithmus = this.getAlgorithmus(Kampfsystem.ko);
      logger.error(`Turniermodus noch nicht implementiert!`);
    }
    
    return;
  }

  async erstelleWettkampfreihenfolgeAltersklasse(altersKlasse: Altersklasse): Promise<void> {
    logger.debug(`Erstelle Wettkampfreihenfolge für altersklasse...`, {data: altersKlasse});
    
    const einstellungen = await einstellungenRepo.load();
    const gwks = await gewichtsklassenGruppenService.ladeAltersklasse(altersKlasse);
    if (einstellungen.turnierTyp == TurnierTyp.randori) {
      const algorithmus = new JederGegenJeden();
      const wettkampfGruppen = await this.erstelleWettkampfgruppen(gwks, algorithmus, einstellungen.mattenAnzahl);
      const matten: Matte[] = await this.erstelleGruppenReihenfolgeRandori(wettkampfGruppen, einstellungen.mattenAnzahl);
    
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
    logger.debug(`Lösche Wettkampfreihenfolge für altersklasse...`, {data: altersKlasse});
    await wettkampfRepo.loescheWettkaempfe(altersKlasse);
    return;
  }

  erstelleWettkampfgruppen(gewichtsklassenGruppen: GewichtsklassenGruppe[], algorithmus: Algorithmus, anzahlMatten: number): WettkampfGruppe[] {
    logger.debug("erstelle alle Begegnungen in jeder gegebenen Gruppe");
    // erstelle alle Begegnungen in jeder Gruppe
    let wettkampfGruppen: WettkampfGruppe[] = [];
    for (let i = 0; i < gewichtsklassenGruppen.length; i++) {
      const gruppe = gewichtsklassenGruppen[i];
      const wkg = algorithmus.erstelleWettkampfGruppen(i, gruppe, anzahlMatten);
      wettkampfGruppen.push(...wkg);
    }
    return wettkampfGruppen;
  }
  
  erstelleGruppenReihenfolgeRandori(wettkampfGruppen: WettkampfGruppe[], anzahlMatten: number): Matte[] {
    logger.debug("erstelle Reihenfolge der Begegnungen");
    let matten : Matte[] = [];

    // Ausplitten der Begegnungen auf die Matten
    let wettkampfGruppenJeMatten = this.splitArray(wettkampfGruppen, anzahlMatten);
    
    for (let m = 0; m < anzahlMatten; m++) {
      matten.push({ id: m+1, runden: []});
      const gruppen = wettkampfGruppenJeMatten[m];
      
      // sortiere die Gruppen, sodass die Gruppen mit wenigen Kämpfen ganz hinten sind
      gruppen.sort((gs1, gs2) => gs2.begegnungsRunden.length - gs1.begegnungsRunden.length);
      this.log(gruppen)
     
      
      let rundenNummer = 0;

      // gerade Anzahl an Gruppen -> 2 Gruppen je Matte
      if (gruppen.length % 2 == 0) {
        logger.debug("Berechne gerade Anzahl an Gruppen");

        rundenNummer = gruppiereAbwechselnd(gruppen, rundenNummer, m);          
      }
      // ungerade Anzahl an Gruppen -> 2 Gruppen je Matte und einmal 3 Gruppen je Matte
      else {
        logger.debug("Berechne ungerade Anzahl an Gruppen");
        if (gruppen.length > 1) {
          logger.debug("Wir haben mehr als 1 Gruppe, also splitten wir")
          // behandle die letzten 3 Gruppen separat und gruppiere zuerst die anderen Gruppen
          const letztenDreiGruppen = gruppen.slice(gruppen.length-3, gruppen.length)
          const andereGruppen = gruppen.slice(0, gruppen.length-3)
          rundenNummer = gruppiereAbwechselnd(andereGruppen, rundenNummer, m);
          
          // jetzt die letzten drei Gruppen
          const gruppe1 = letztenDreiGruppen[0];
          const gruppe2 = letztenDreiGruppen[1];
          const gruppe3 = letztenDreiGruppen[2];
          const altersKlasse1 = gruppe1.begegnungsRunden[0][0].wettkaempfer1.altersklasse;
          const altersKlasse2 = gruppe2.begegnungsRunden[0][0].wettkaempfer1.altersklasse;
          const altersKlasse3 = gruppe3.begegnungsRunden[0][0].wettkaempfer1.altersklasse;

          // Abwechselnd die Begegnungen der gruppe1 und gruppe2 nehmen und der Matte hinzufügen
          for (let r = 0; r < Math.max(gruppe1.begegnungsRunden.length, gruppe2.begegnungsRunden.length, gruppe3.begegnungsRunden.length); r++) {
            if (gruppe1.begegnungsRunden[r]) {
              const runde1: Runde = { id: rundenNummer, runde: rundenNummer + 1, altersklasse: altersKlasse1, gruppe: gruppe1, begegnungen: gruppe1.begegnungsRunden[r] };
              matten[m].runden.push(runde1);
              rundenNummer += 1;
            }
            if (gruppe2.begegnungsRunden[r]) {
              const runde2: Runde = { id: rundenNummer, runde: rundenNummer + 1, altersklasse: altersKlasse2, gruppe: gruppe2, begegnungen: gruppe2.begegnungsRunden[r] };
              matten[m].runden.push(runde2);
              rundenNummer += 1;
            }
            if (gruppe3.begegnungsRunden[r]) {
              const runde3: Runde = { id: rundenNummer, runde: rundenNummer + 1, altersklasse: altersKlasse3, gruppe: gruppe3, begegnungen: gruppe3.begegnungsRunden[r] };
              matten[m].runden.push(runde3);
              rundenNummer += 1;
            }
          }
              
        }
        else {
          logger.debug("Es existiert nur eine Gruppe, daher fügen wir diese komplett hinzu")
          const gruppeZuletzt = gruppen[gruppen.length-1];
          for (let r = 0; r < gruppeZuletzt.begegnungsRunden.length; r++) {
            const altersKlasseZuletzt = gruppeZuletzt.begegnungsRunden[0][0].wettkaempfer1.altersklasse;
            const rundeZuletzt: Runde = { id:rundenNummer, runde: rundenNummer+1, altersklasse: altersKlasseZuletzt, gruppe: gruppeZuletzt, begegnungen: gruppeZuletzt.begegnungsRunden[r]};
            matten[m].runden.push(rundeZuletzt);
            rundenNummer +=1;
          }
        }
      }
    }
    return matten;

    function gruppiereAbwechselnd(gruppen: WettkampfGruppe[], rundenNummer: number, m: number) {
      logger.debug("Gruppiere abwechselnd...");
      for (let gruppenNr = 0; gruppenNr < Math.floor(gruppen.length / 2); gruppenNr += 2) {
        const gruppe1 = gruppen[gruppenNr];
        const gruppe2 = gruppen[gruppenNr + 1];
        const altersKlasse1 = gruppe1.begegnungsRunden[0][0].wettkaempfer1.altersklasse;
        const altersKlasse2 = gruppe2.begegnungsRunden[0][0].wettkaempfer1.altersklasse;

        // Abwechselnd die Begegnungen der gruppe1 und gruppe2 nehmen und der Matte hinzufügen
        for (let r = 0; r < Math.max(gruppe1.begegnungsRunden.length, gruppe2.begegnungsRunden.length); r++) {
          if (gruppe1.begegnungsRunden[r]) {
            const runde1: Runde = { id: rundenNummer, runde: rundenNummer + 1, altersklasse: altersKlasse1, gruppe: gruppe1, begegnungen: gruppe1.begegnungsRunden[r] };
            matten[m].runden.push(runde1);
            rundenNummer += 1;
          }
          if (gruppe2.begegnungsRunden[r]) {
            const runde2: Runde = { id: rundenNummer, runde: rundenNummer + 1, altersklasse: altersKlasse2, gruppe: gruppe2, begegnungen: gruppe2.begegnungsRunden[r] };
            matten[m].runden.push(runde2);
            rundenNummer += 1;
          }
        }
      }
      return rundenNummer;
    }
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

  private log(gruppe: WettkampfGruppe[]): void {
    
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
}