import { Wettkaempfer } from "../model/wettkaempfer";
import { Begegnung } from "../model/begegnung";

const PAUSEN = 2;

export class Sortierer {

  sortiereBegegnungen(begegnungen: Begegnung[]): Begegnung[] {
    const sortedBegegnungen: Begegnung[] = [...begegnungen];
    
    for (let i = 0; i < sortedBegegnungen.length - 2; i++) {
      for (let j = 0; j < sortedBegegnungen.length - i - 2; j++) {
        // console.log(`${i} ${j}: `, sortedBegegnungen[j], begegnungen[j]);
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