import { RandoriWertung, TurnierWertung } from "./wertung";
import { Wettkaempfer } from "./wettkaempfer";

export interface Begegnung {
  wettkaempfer1: Wettkaempfer;
  wettkaempfer2?: Wettkaempfer;
  turnierWertung?: TurnierWertung;
  randoriWertung?: RandoriWertung;
}