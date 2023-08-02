export enum TurnierTyp {
  randori = "Randori",
  standard = "Standard"
}

export interface Einstellungen {
  turnierTyp: TurnierTyp;
}