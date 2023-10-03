import { Wettkaempfer } from "../model/wettkaempfer";
import { Begegnung } from "../model/begegnung";
import { WettkampfGruppe } from "../model/wettkampfgruppe";
import { Matte, Runde } from "../model/matte";
import { getLogger } from './logger';

const PAUSEN = 2;

const logger = getLogger('Sortierer');

export class Sortierer {

  /*
    Es werd die erste Runde aller Gruppen gekämpft, danach die zweite Runde aller Gruppen usw.
  */
  public erstelleReihenfolgeMitAllenGruppenJeDurchgang(gruppen: WettkampfGruppe[], matte: Matte): Matte {
    logger.warn("Reihenfolge ALLE noch nicht implementiert!")
    throw new Error("nicht implementiert");        
  }
  
  /*
    Es werden immer zwei Gruppen abwechselnd kämpfen, bis in diesen Gruppen alle Runden gekämpft sind, danach kommen die nächsten beiden Gruppen an die Reihe.
    Bei ungerader Anzahl wechseln sich die letzten drei Gruppen ab, davor gilt weiterhin, dass immer zwei Gruppen abwechselnd an der Reihe sind.
  */
  public erstelleReihenfolgeMitAbwechselndenGruppen(gruppen: WettkampfGruppe[], matte: Matte): Matte {
    let rundenNummer = 0;
    let neueMatte = matte;
    // gerade Anzahl an Gruppen -> 2 Gruppen je Matte
    if (gruppen.length % 2 == 0) {
      logger.debug("Berechne gerade Anzahl an Gruppen");
      let [, neueMatte] = this.gruppiereAbwechselnd(gruppen, rundenNummer, matte);
      return neueMatte;
    }
    // ungerade Anzahl an Gruppen -> 2 Gruppen je Matte und einmal 3 Gruppen je Matte
    else {
      logger.debug("Berechne ungerade Anzahl an Gruppen");
      if (gruppen.length > 1) {
        logger.debug("Wir haben mehr als 1 Gruppe, also splitten wir");
        // behandle die letzten 3 Gruppen separat und gruppiere zuerst die anderen Gruppen
        const letztenDreiGruppen = gruppen.slice(gruppen.length - 3, gruppen.length);
        const andereGruppen = gruppen.slice(0, gruppen.length - 3);
        let [neueRundenNummer, neueMatte] = this.gruppiereAbwechselnd(andereGruppen, rundenNummer, matte);
        rundenNummer = neueRundenNummer;

        // jetzt die letzten drei Gruppen
        const gruppe1 = letztenDreiGruppen[0];
        const gruppe2 = letztenDreiGruppen[1];
        const gruppe3 = letztenDreiGruppen[2];
        const altersKlasse1 = gruppe1.begegnungsRunden[0][0].wettkaempfer1.altersklasse;
        const altersKlasse2 = gruppe2.begegnungsRunden[0][0].wettkaempfer1.altersklasse;
        const altersKlasse3 = gruppe3.begegnungsRunden[0][0].wettkaempfer1.altersklasse;

        // Abwechselnd die Begegnungen der gruppe1 und gruppe2 nehmen und der Matte hinzufügen
        for (let r = 0; r < Math.max(gruppe1.begegnungsRunden.length, gruppe2.begegnungsRunden.length, gruppe3.begegnungsRunden.length); r++) {
          let rundenName = rundenNummer + 1;
          if (gruppe1.begegnungsRunden[r]) {
            const runde1: Runde = { id: rundenNummer, runde: rundenName, altersklasse: altersKlasse1, gruppe: gruppe1, begegnungen: gruppe1.begegnungsRunden[r] };
            neueMatte.runden.push(runde1);
            rundenNummer += 1;
          }
          if (gruppe2.begegnungsRunden[r]) {
            const runde2: Runde = { id: rundenNummer, runde: rundenName, altersklasse: altersKlasse2, gruppe: gruppe2, begegnungen: gruppe2.begegnungsRunden[r] };
            neueMatte.runden.push(runde2);
            rundenNummer += 1;
          }
          if (gruppe3.begegnungsRunden[r]) {
            const runde3: Runde = { id: rundenNummer, runde: rundenName, altersklasse: altersKlasse3, gruppe: gruppe3, begegnungen: gruppe3.begegnungsRunden[r] };
            neueMatte.runden.push(runde3);
            rundenNummer += 1;
          }
        }

        return neueMatte;
      }
      else {
        logger.debug("Es existiert nur eine Gruppe, daher fügen wir diese komplett hinzu");
        const gruppeZuletzt = gruppen[gruppen.length - 1];
        for (let r = 0; r < gruppeZuletzt.begegnungsRunden.length; r++) {
          const altersKlasseZuletzt = gruppeZuletzt.begegnungsRunden[0][0].wettkaempfer1.altersklasse;
          let rundenName = rundenNummer + 1;
          const rundeZuletzt: Runde = { id: rundenNummer, runde: rundenName, altersklasse: altersKlasseZuletzt, gruppe: gruppeZuletzt, begegnungen: gruppeZuletzt.begegnungsRunden[r] };
          neueMatte.runden.push(rundeZuletzt);
          rundenNummer += 1;
        }

        return neueMatte;
      }
    }
  }

  private gruppiereAbwechselnd(gruppen: WettkampfGruppe[], rundenNummer: number, matte: Matte): [number, Matte] {
    const resultMatte: Matte = matte;
    let resultRundenNummer = rundenNummer;
    for (let gruppenNr = 0; gruppenNr < gruppen.length; gruppenNr += 2) {
      const gruppe1 = gruppen[gruppenNr];
      const gruppe2 = gruppen[gruppenNr + 1];
      const altersKlasse1 = gruppe1.begegnungsRunden[0][0].wettkaempfer1.altersklasse;
      const altersKlasse2 = gruppe2.begegnungsRunden[0][0].wettkaempfer1.altersklasse;

      // Abwechselnd die Begegnungen der gruppe1 und gruppe2 nehmen und der Matte hinzufügen
      for (let r = 0; r < Math.max(gruppe1.begegnungsRunden.length); r++) {
        let rundenName = resultRundenNummer + 1;
        if (gruppe1.begegnungsRunden[r]) {
          const runde1: Runde = { id: resultRundenNummer, runde: rundenName, altersklasse: altersKlasse1, gruppe: gruppe1, begegnungen: gruppe1.begegnungsRunden[r] };
          resultMatte.runden.push(runde1);
          resultRundenNummer += 1;
        }
        if (gruppe2.begegnungsRunden[r]) {
          const runde2: Runde = { id: resultRundenNummer, runde: rundenName, altersklasse: altersKlasse2, gruppe: gruppe2, begegnungen: gruppe2.begegnungsRunden[r] };
          resultMatte.runden.push(runde2);
          resultRundenNummer += 1;
        }
      }
    }
    return [resultRundenNummer, resultMatte];
  }

  sortiereBegegnungen(begegnungen: Begegnung[]): Begegnung[] {
    const sortedBegegnungen: Begegnung[] = [...begegnungen];
    
    for (let i = 0; i < sortedBegegnungen.length - 2; i++) {
      for (let j = 0; j < sortedBegegnungen.length - i - 2; j++) {
        const wettkaempfer1Jetzt = sortedBegegnungen[j].wettkaempfer1;
        const wettkaempfer2Jetzt = sortedBegegnungen[j].wettkaempfer2;
        const wettkaempfer1Danach = sortedBegegnungen[j + 1].wettkaempfer1;
        const wettkaempfer2Danach = sortedBegegnungen[j + 1].wettkaempfer2;
        
        if (wettkaempfer1Jetzt === wettkaempfer1Danach || wettkaempfer1Jetzt === wettkaempfer2Danach ||
          wettkaempfer2Jetzt === wettkaempfer1Danach || wettkaempfer2Jetzt === wettkaempfer2Danach) {
          // Wenn Teilnehmer in aufeinanderfolgenden Begegnungen wiederholt auftreten,
          // tausche die Begegnungen
          this.tauscheBegegnungen(j + 1, j + 2, sortedBegegnungen)
        }
      }
    }
    
    return sortedBegegnungen;
  }
  

  sortiereBegegnungen3(begegnungen: Begegnung[]): Begegnung[] {
    const sortedBegegnungen: Begegnung[] = [...begegnungen];
    let consecutiveCount = 1;
  
    for (let i = 0; i < sortedBegegnungen.length - 1; i++) {
      for (let j = 0; j < sortedBegegnungen.length - i - 1; j++) {
        const teilnehmerA1 = sortedBegegnungen[j].wettkaempfer1;
        const teilnehmerA2 = sortedBegegnungen[j].wettkaempfer2;
        const teilnehmerB1 = sortedBegegnungen[j + 1].wettkaempfer1;
        const teilnehmerB2 = sortedBegegnungen[j + 1].wettkaempfer2;
  
        if (
          this.istTeilnehmerInAufeinanderfolgendenBegegnungen(teilnehmerA1, sortedBegegnungen) ||
          this.istTeilnehmerInAufeinanderfolgendenBegegnungen(teilnehmerA2!, sortedBegegnungen)
        ) {
          this.tauscheBegegnungen(j, j + 1, sortedBegegnungen);
          consecutiveCount = 1;
        } else if (
          (teilnehmerA1 === teilnehmerB1 || teilnehmerA1 === teilnehmerB2) &&
          (teilnehmerA2 === teilnehmerB1 || teilnehmerA2 === teilnehmerB2)
        ) {
          consecutiveCount++;
        } else {
          consecutiveCount = 1;
        }
  
        if (consecutiveCount === 3) {
          this.tauscheBegegnungen(j + 1, j + 2, sortedBegegnungen);
          consecutiveCount = 1;
        }
      }
    }
  
    return sortedBegegnungen;
  }
  
  private istTeilnehmerInAufeinanderfolgendenBegegnungen(teilnehmer: Wettkaempfer, sortedBegegnungen: Begegnung[]): boolean {
    for (let i = 0; i < sortedBegegnungen.length - 2; i++) {
      if (
        sortedBegegnungen[i].wettkaempfer1 === teilnehmer ||
        sortedBegegnungen[i].wettkaempfer2 === teilnehmer ||
        sortedBegegnungen[i + 1].wettkaempfer1 === teilnehmer ||
        sortedBegegnungen[i + 1].wettkaempfer2 === teilnehmer ||
        sortedBegegnungen[i + 2].wettkaempfer1 === teilnehmer ||
        sortedBegegnungen[i + 2].wettkaempfer2 === teilnehmer
      ) {
        return true;
      }
    }
    return false;
  }

  private tauscheBegegnungen(indexA: number, indexB: number, sortedBegegnungen: Begegnung[]) {
    const temp = sortedBegegnungen[indexA];
    sortedBegegnungen[indexA] = sortedBegegnungen[indexB];
    sortedBegegnungen[indexB] = temp;
  }
}