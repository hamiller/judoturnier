export enum TurnierTyp {
  randori = "Randori",
  standard = "Standard"
}

export enum WettkampfReihenfolge {
  abwechselnd = "Abwechselnd",
  alle = "Alle"
}

export interface Einstellungen {
  turnierTyp: TurnierTyp,
  mattenAnzahl: number,
  wettkampfReihenfolge: WettkampfReihenfolge
}