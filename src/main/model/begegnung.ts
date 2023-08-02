import { Wettkaempfer } from "./wettkaempfer";

export interface Begegnung {
  wettkaempfer1: Wettkaempfer;
  wettkaempfer2?: Wettkaempfer;
}