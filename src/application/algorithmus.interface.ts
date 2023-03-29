import { Begegnung } from "../model/begegnung";
import { Wettkaempfer } from "../model/wettkaempfer";

export interface Algorithmus {
  berechneMatch(wettkaempferListe: Wettkaempfer[]):  Begegnung[]
}