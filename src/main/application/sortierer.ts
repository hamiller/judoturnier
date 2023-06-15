import { Wettkaempfer } from "../model/wettkaempfer";
import { Begegnung } from "../model/begegnung";

export class Sortierer {

  sortiereBegegnungen(begegnungen: Begegnung[]): Begegnung[] {
    const sortedBegegnungen: Begegnung[] = [...begegnungen];
    
    for (let i = 0; i < sortedBegegnungen.length - 1; i++) {
      console.log(i, sortedBegegnungen[i]);
      const teilnehmerA1 = sortedBegegnungen[i].wettkaempfer1;
      const teilnehmerA2 = sortedBegegnungen[i].wettkaempfer2;
      const teilnehmerB1 = sortedBegegnungen[i + 1].wettkaempfer1;
      const teilnehmerB2 = sortedBegegnungen[i + 1].wettkaempfer2;
      
      if (teilnehmerA1 === teilnehmerB1 || teilnehmerA1 === teilnehmerB2 ||
          teilnehmerA2 === teilnehmerB1 || teilnehmerA2 === teilnehmerB2) {
        // Wenn Teilnehmer in aufeinanderfolgenden Begegnungen wiederholt auftreten,
        // tausche die Begegnungen
        const temp = sortedBegegnungen[i + 1];
        sortedBegegnungen[i + 1] = sortedBegegnungen[i + 2];
        sortedBegegnungen[i + 2] = temp;
      }
    }
    
    return sortedBegegnungen;
  }
  
  sortiereBegegnungen2(begegnungen: Begegnung[], mattenAnzahl: number): Begegnung[] {
    // Sortiere die Begegnungen nach Kämpfern
    begegnungen.sort((a, b) => {
      if (a.wettkaempfer1 === b.wettkaempfer1) {
        return a.wettkaempfer2.name.localeCompare(b.wettkaempfer2.name);
      }
      return a.wettkaempfer1.name.localeCompare(b.wettkaempfer1.name);
    });

    // Überprüfe jede Begegnung, um sicherzustellen, dass kein Kämpfer in zwei aufeinanderfolgenden Begegnungen auftritt
    for (let i = 1; i < begegnungen.length; i++) {
      console.log("AvsB:", begegnungen[i].wettkaempfer1.name, begegnungen[i-1].wettkaempfer1.name)
      if (begegnungen[i].wettkaempfer1 === begegnungen[i - 1].wettkaempfer1) {
        console.log("tausch")
        const temp = begegnungen[i];
        begegnungen[i] = begegnungen[i - 1];
        begegnungen[i - 1] = temp;
      }
    }

    return begegnungen;
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
          this.istTeilnehmerInAufeinanderfolgendenBegegnungen(teilnehmerA2, sortedBegegnungen)
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




  sortiereBegegnungen5(begegnungen: Begegnung[]): Begegnung[] {
    const sortedBegegnungen: Begegnung[] = [...begegnungen];
    let consecutiveCount = 1;
  
    function istTeilnehmerInAufeinanderfolgendenBegegnungen(teilnehmer: Wettkaempfer): boolean {
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
  
    function tauscheBegegnungen(indexA: number, indexB: number) {
      const temp = sortedBegegnungen[indexA];
      sortedBegegnungen[indexA] = sortedBegegnungen[indexB];
      sortedBegegnungen[indexB] = temp;
    }
  
    for (let i = 0; i < sortedBegegnungen.length - 1; i++) {
      for (let j = 0; j < sortedBegegnungen.length - i - 1; j++) {
        const teilnehmerA1 = sortedBegegnungen[j].wettkaempfer1;
        const teilnehmerA2 = sortedBegegnungen[j].wettkaempfer2;
        const teilnehmerB1 = sortedBegegnungen[j + 1].wettkaempfer1;
        const teilnehmerB2 = sortedBegegnungen[j + 1].wettkaempfer2;
  
        if (
          istTeilnehmerInAufeinanderfolgendenBegegnungen(teilnehmerA1) ||
          istTeilnehmerInAufeinanderfolgendenBegegnungen(teilnehmerA2)
        ) {
          tauscheBegegnungen(j, j + 1);
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
          tauscheBegegnungen(j + 1, j + 2);
          consecutiveCount = 1;
        }
      }
    }
  
    return sortedBegegnungen;
  }
}