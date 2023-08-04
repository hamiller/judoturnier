import { Wettkaempfer } from "./wettkaempfer";

export interface TurnierWertung {
  id: number;
  sieger: Wettkaempfer;
  zeit: number;
  punkteWettkaempfer1: number;
  strafenWettkaempfer1: number;
  punkteWettkaempfer2: number;
  strafenWettkaempfer2: number;
}

export interface RandoriWertung {
  id: number;
  kampfgeistWettkaempfer1: number;
  technikWettkaempfer1: number;
  kampfstilWettkaempfer1: number;
  fairnessWettkaempfer1: number;

  kampfgeistWettkaempfer2: number;
  technikWettkaempfer2: number;
  kampfstilWettkaempfer2: number;
  fairnessWettkaempfer2: number;
}