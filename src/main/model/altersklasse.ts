export enum Altersklasse {
  U11 = "U11",
  U13 = "U13",
  U15 = "U15",
  U18 = "U18",
  U21 = "U21",
  Maenner = "Männer",
  Frauen = "Frauen"
}

export const altersklasseSortOrder: { [key in Altersklasse]: number } = {
  [Altersklasse.U11]: 0,
  [Altersklasse.U13]: 1,
  [Altersklasse.U15]: 2,
  [Altersklasse.U18]: 3,
  [Altersklasse.U21]: 4,
  [Altersklasse.Maenner]: 5,
  [Altersklasse.Frauen]: 6,
};