import { Wettkaempfer } from "./wettkaempfer";

export interface Wertung {
  id: number;

  // turnier
  sieger: Wettkaempfer | null;
  zeit: number;
  punkteWettkaempfer_weiss: number;
  strafenWettkaempfer_weiss: number;
  punkteWettkaempfer_blau: number;
  strafenWettkaempfer_blau: number;

  // randori
  kampfgeistWettkaempfer1: number;
  technikWettkaempfer1: number;
  kampfstilWettkaempfer1: number;
  fairnessWettkaempfer1: number;

  kampfgeistWettkaempfer2: number;
  technikWettkaempfer2: number;
  kampfstilWettkaempfer2: number;
  fairnessWettkaempfer2: number;
}