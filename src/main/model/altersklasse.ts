export enum Altersklasse {
  U9 = "U9",
  U11 = "U11",
  U13 = "U13",
  U15 = "U15",
  U18 = "U18",
  U21 = "U21",
  Maenner = "Männer",
  Frauen = "Frauen"
}

export const altersklasseSortOrder: { [key in Altersklasse]: number } = {
  [Altersklasse.U9]: 0,
  [Altersklasse.U11]: 1,
  [Altersklasse.U13]: 2,
  [Altersklasse.U15]: 3,
  [Altersklasse.U18]: 4,
  [Altersklasse.U21]: 5,
  [Altersklasse.Maenner]: 6,
  [Altersklasse.Frauen]: 7,
};