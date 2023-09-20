import { Wertung } from "./wertung";
import { Wettkaempfer } from "./wettkaempfer";

export interface Begegnung {
  begegnung_id?: number;
  wettkaempfer1: Wettkaempfer;
  wettkaempfer2?: Wettkaempfer;
  wertung?: Wertung;
}