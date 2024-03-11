import { Wettkaempfer } from "../model/wettkaempfer";
import { Begegnung } from "../model/begegnung";
import { WettkampfGruppe } from "../model/wettkampfgruppe";
import { Matte, Runde } from "../model/matte";
import { getLogger } from './logger';
import { Altersklasse } from "../model/altersklasse";
import { Geschlecht } from "../model/geschlecht";

const PAUSEN = 2;

const logger = getLogger('Sortierer');

export class Sortierer {

  /*
    Es werd die erste Runde aller Gruppen gekämpft, danach die zweite Runde aller Gruppen usw.
  */
  public erstelleReihenfolgeMitAllenGruppenJeDurchgang(gruppen: WettkampfGruppe[]): Runde[] {
    logger.debug("erstelleReihenfolgeMitAllenGruppenJeDurchgang...");
    let runden: Runde[] = [];
    const maxRundenNummer = 100; // todo
    for (let rundenNummer = 0; rundenNummer < maxRundenNummer; rundenNummer += 1) {
      for (let gruppenNr = 0; gruppenNr < gruppen.length; gruppenNr += 1) {
        const gruppe = gruppen[gruppenNr];
        let runde = this.kopiereRunde(rundenNummer, gruppe);        
        if (runde) {
          // die Gruppe hat eine entsprechende Runde
          runden.push(runde);
        }
      }
    }
    return runden;
  }
  kopiereRunde(rundenNummer: number, gruppe: WettkampfGruppe): Runde | undefined {
    if (!gruppe.alleGruppenBegegnungen[rundenNummer]) return undefined;

    const rundenName = rundenNummer + 1;
    const altersKlasse = gruppe.alleGruppenBegegnungen[rundenNummer][0].wettkaempfer1.altersklasse;
    return { id: rundenNummer, matten_runde: rundenName, gruppen_runde: 0, rundeTotal: undefined, altersklasse: altersKlasse, gruppe: gruppe, begegnungen: gruppe.alleGruppenBegegnungen[rundenNummer] };
  }
  
  /*
    Es werden immer zwei Gruppen abwechselnd kämpfen, bis in diesen Gruppen alle Runden gekämpft sind, danach kommen die nächsten beiden Gruppen an die Reihe.
    Bei ungerader Anzahl wechseln sich die letzten drei Gruppen ab, davor gilt weiterhin, dass immer zwei Gruppen abwechselnd an der Reihe sind.
  */
  public erstelleReihenfolgeMitAbwechselndenGruppen(gruppen: WettkampfGruppe[]): Runde[] {
    logger.debug("erstelleReihenfolgeMitAbwechselndenGruppen...");
    let rundenNummer = 0;
    let runden: Runde[] = [];
    // gerade Anzahl an Gruppen -> 2 Gruppen je Matte
    if (gruppen.length % 2 == 0) {
      logger.debug("Berechne gerade Anzahl an Gruppen (" + gruppen.length + ")");
      let [, neueRunden] = this.gruppiereAbwechselndPaare(gruppen, rundenNummer);
      runden = runden.concat(neueRunden);
    }
    // ungerade Anzahl an Gruppen -> 2 Gruppen je Matte und einmal 3 Gruppen je Matte
    else {
      logger.debug("Berechne ungerade Anzahl an Gruppen");
      if (gruppen.length > 1) {
        logger.debug("Wir haben mehr als 1 Gruppe, also splitten wir");
        // behandle die letzten 3 Gruppen separat und gruppiere zuerst die anderen Gruppen
        const letztenDreiGruppen = gruppen.slice(gruppen.length - 3, gruppen.length);
        const andereGruppen = gruppen.slice(0, gruppen.length - 3);
        let [neueRundenNummer, neueRunden] = this.gruppiereAbwechselndPaare(andereGruppen, rundenNummer);
        runden = runden.concat(neueRunden);
        rundenNummer = neueRundenNummer;

        // jetzt die letzten drei Gruppen
        [neueRundenNummer, neueRunden] = this.gruppiereAbwechselndTrios(letztenDreiGruppen, rundenNummer);
        runden = runden.concat(neueRunden);
        rundenNummer = neueRundenNummer;
      }
      else {
        logger.info("Es existiert nur eine Gruppe, daher fügen wir diese komplett hinzu");
        const gruppeZuletzt = gruppen[gruppen.length - 1];
        let gruppeRunde = 0;
        for (let r = 0; r < gruppeZuletzt.alleGruppenBegegnungen.length; r++) {
          const altersKlasseZuletzt = gruppeZuletzt.alleGruppenBegegnungen[0][0].wettkaempfer1.altersklasse;
          gruppeRunde += 1
          let rundenName = rundenNummer + 1;
          const rundeZuletzt: Runde = { id: rundenNummer, matten_runde: rundenName, gruppen_runde: gruppeRunde, rundeTotal: undefined, altersklasse: altersKlasseZuletzt, gruppe: gruppeZuletzt, begegnungen: gruppeZuletzt.alleGruppenBegegnungen[r] };
          runden.push(rundeZuletzt);
          rundenNummer += 1;
        }
      }
    }
    return runden;
  }

  private gruppiereAbwechselndPaare(gruppen: WettkampfGruppe[], rundenNummer: number): [number, Runde[]] {
    const runden: Runde[] = [];
    let resultRundenNummer = rundenNummer;
    for (let gruppenNr = 0; gruppenNr < gruppen.length; gruppenNr += 2) {
      const gruppe1 = gruppen[gruppenNr];
      const gruppe2 = gruppen[gruppenNr + 1];
      const altersKlasse1 = gruppe1.alleGruppenBegegnungen[0][0].wettkaempfer1.altersklasse;
      const altersKlasse2 = gruppe2.alleGruppenBegegnungen[0][0].wettkaempfer1.altersklasse;

      let gruppe1Runde = 0;
      let gruppe2Runde = 0;
      // Abwechselnd die Begegnungen der gruppe1 und gruppe2 nehmen und der Matte hinzufügen
      for (let r = 0; r < Math.max(gruppe1.alleGruppenBegegnungen.length, gruppe2.alleGruppenBegegnungen.length); r++) {
        if (gruppe1.alleGruppenBegegnungen[r]) {
          gruppe1Runde += 1;
          let rundenName = resultRundenNummer + 1;
          const runde1: Runde = { id: resultRundenNummer, matten_runde: rundenName, gruppen_runde: gruppe1Runde, rundeTotal: undefined, altersklasse: altersKlasse1, gruppe: gruppe1, begegnungen: gruppe1.alleGruppenBegegnungen[r] };
          runden.push(runde1);
          resultRundenNummer += 1;
        }
        else {
          // Gruppe 1 hat keine Teilnehmer mehr, wir fügen daher einen Dummy (zB Pause) ein
          logger.info("Gruppe 1 (von 2) ist leer, füge Dummy ein")
          gruppe1Runde += 1
          let rundenName = resultRundenNummer + 1;
          runden.push(this.dummyRunde(resultRundenNummer, rundenName, gruppe1Runde, altersKlasse1, gruppe1));
        }

        if (gruppe2.alleGruppenBegegnungen[r]) {
          gruppe2Runde += 1
          let rundenName = resultRundenNummer + 1;
          const runde2: Runde = { id: resultRundenNummer, matten_runde: rundenName, gruppen_runde: gruppe2Runde, rundeTotal: undefined, altersklasse: altersKlasse2, gruppe: gruppe2, begegnungen: gruppe2.alleGruppenBegegnungen[r] };
          runden.push(runde2);
          resultRundenNummer += 1;
        }
        else {
          // Gruppe 2 hat keine Teilnehmer mehr, wir fügen daher einen Dummy (zB Pause) ein
          logger.info("Gruppe 2 (von 2) ist leer, füge Dummy ein")
          gruppe2Runde += 1
          let rundenName = resultRundenNummer + 1;
          runden.push(this.dummyRunde(resultRundenNummer, rundenName, gruppe2Runde, altersKlasse2, gruppe2));
        }
      }
    }
    return [resultRundenNummer, runden];
  }

  private dummyRunde(resultRundenNummer: number, rundenName: number, gruppenRunde: number, altersKlasse: Altersklasse, gruppe: WettkampfGruppe): Runde {
    logger.debug("erstelle Pause")
    const pause: Begegnung = {wettkaempfer1: {
      name: "Pause",
      geschlecht: Geschlecht.m,
      altersklasse: altersKlasse,
      verein: {name: ""},
      checked: false,
      printed: false
    }};
    return { id: resultRundenNummer, matten_runde: rundenName, gruppen_runde: gruppenRunde, rundeTotal: undefined, altersklasse: altersKlasse, gruppe: gruppe, begegnungen: [pause] };
  }

  private gruppiereAbwechselndTrios(gruppen: WettkampfGruppe[], rundenNummer: number): [number, Runde[]] {
    const runden: Runde[] = [];
    const gruppe1 = gruppen[0];
    const gruppe2 = gruppen[1];
    const gruppe3 = gruppen[2];
    const altersKlasse1 = gruppe1.alleGruppenBegegnungen[0][0].wettkaempfer1.altersklasse;
    const altersKlasse2 = gruppe2.alleGruppenBegegnungen[0][0].wettkaempfer1.altersklasse;
    const altersKlasse3 = gruppe3.alleGruppenBegegnungen[0][0].wettkaempfer1.altersklasse;

    let resultRundenNummer = rundenNummer;
    let gruppe1Runde = 0;
    let gruppe2Runde = 0;
    let gruppe3Runde = 0;
        
    // Abwechselnd die Begegnungen der gruppe1 und gruppe2 nehmen und der Matte hinzufügen
    for (let r = 0; r < Math.max(gruppe1.alleGruppenBegegnungen.length, gruppe2.alleGruppenBegegnungen.length, gruppe3.alleGruppenBegegnungen.length); r++) {
      if (gruppe1.alleGruppenBegegnungen[r]) {
        gruppe1Runde += 1;
        let rundenName = rundenNummer + 1;
        const runde1: Runde = { id: rundenNummer, matten_runde: rundenName, gruppen_runde: gruppe1Runde, rundeTotal: undefined, altersklasse: altersKlasse1, gruppe: gruppe1, begegnungen: gruppe1.alleGruppenBegegnungen[r] };
        runden.push(runde1);
        rundenNummer += 1;
      }
      else {
        // Gruppe 1 hat keine Teilnehmer mehr, wir fügen daher einen Dummy (zB Pause) ein
        logger.info("Gruppe 1 (von 3) ist leer, füge Dummy ein")
      }

      if (gruppe2.alleGruppenBegegnungen[r]) {
        gruppe2Runde += 1;
        let rundenName = rundenNummer + 1;
        const runde2: Runde = { id: rundenNummer, matten_runde: rundenName, gruppen_runde: gruppe2Runde, rundeTotal: undefined, altersklasse: altersKlasse2, gruppe: gruppe2, begegnungen: gruppe2.alleGruppenBegegnungen[r] };
        runden.push(runde2);
        rundenNummer += 1;
      }
      else {
        // Gruppe 2 hat keine Teilnehmer mehr, wir fügen daher einen Dummy (zB Pause) ein
        logger.info("Gruppe 2 (von 3) ist leer, füge Dummy ein")
      }

      if (gruppe3.alleGruppenBegegnungen[r]) {
        gruppe3Runde += 1;
        let rundenName = rundenNummer + 1;
        const runde3: Runde = { id: rundenNummer, matten_runde: rundenName, gruppen_runde: gruppe3Runde, rundeTotal: undefined, altersklasse: altersKlasse3, gruppe: gruppe3, begegnungen: gruppe3.alleGruppenBegegnungen[r] };
        runden.push(runde3);
        rundenNummer += 1;
      }
      else {
        // Gruppe 3 hat keine Teilnehmer mehr, wir fügen daher einen Dummy (zB Pause) ein
        logger.info("Gruppe 3 (von 3) ist leer, füge Dummy ein")
      }
    }
    return [resultRundenNummer, runden];
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