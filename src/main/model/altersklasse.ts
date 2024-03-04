export enum Altersklasse {
  U9 = "U9",
  U11 = "U11",
  U12 = "U12",
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
  [Altersklasse.U12]: 2,
  [Altersklasse.U13]: 3,
  [Altersklasse.U15]: 4,
  [Altersklasse.U18]: 5,
  [Altersklasse.U21]: 6,
  [Altersklasse.Maenner]: 7,
  [Altersklasse.Frauen]: 8,
};