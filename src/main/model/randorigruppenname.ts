export enum RandoriGruppenName {
  Löwen,
  Igel,
  Tiger,
  Elefant,
  Löwe,
  Giraffe,
  Leopard,
  Gepard,
  Marder,
  Eichhörnchen,
  Bär,
  Affe,
  Wal,
  Wildkatze,
  Wolf,
  Ameise,
  Biene,
  Delfin,
  Hai,
  Iltis,
  Antilope,
  Hummel,
  Wiesel,
  Hase,
  Kaninchen,
  Adler,
  Falke,
  Bussard,
  Panther,
  Leguan,
  Eule,
  Maus,
  Dachs,
  Kiwi,
  Känguruh,
  Reh,
  Spatz,
  Ente,
  Schnabeltier
}

export function alleGruppenNamen(): RandoriGruppenName[] {
  return Object.values(RandoriGruppenName).filter((item) => isNaN(Number(item))) as RandoriGruppenName[];
}

export function randomRandoriGruppenNamen(count: number): RandoriGruppenName[] {
  const enumValues = Object.values(RandoriGruppenName).filter((item) => isNaN(Number(item))) as RandoriGruppenName[]; // Alle Enum-Werte abrufen
  const result: RandoriGruppenName[] = [];
  while (result.length < count && enumValues.length > 0) {
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    const randomEntry = enumValues.splice(randomIndex, 1)[0]; // Zufälligen Wert aus dem Array entfernen
    result.push(randomEntry); // Wert zum Ergebnis hinzufügen
  }

  return result;
}