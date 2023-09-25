import assert from 'assert';
import { TurnierService } from '../../main/application/turnier.service';
import { Altersklasse } from '../../main/model/altersklasse';
import { Geschlecht } from '../../main/model/geschlecht';
import { JederGegenJeden } from '../../main/application/algorithm/jeder-gegen-jeden';
import { GewichtsklassenGruppe } from '../../main/model/gewichtsklassengruppe';

describe('Erstellen von Begegnungen', () => {

  // ------------------------------------------------------------------
  //    Anzahl der Begegnungen berechnen: begegnungen = n*(n-1)*1/2
  // ------------------------------------------------------------------

  const service = new TurnierService();
  const gewichtsklassenGruppen: GewichtsklassenGruppe[] = [
    {
      altersKlasse: Altersklasse.U11,
      gruppenGeschlecht: Geschlecht.m,
      teilnehmer: [
        { name: 'Teilnehmer A', geschlecht: Geschlecht.m, id: 1, verein: { name: "Verein1" }, altersklasse: Altersklasse.U11 },
        { name: 'Teilnehmer B', geschlecht: Geschlecht.m, id: 2, verein: { name: "Verein2" }, altersklasse: Altersklasse.U11 },
        { name: 'Teilnehmer C', geschlecht: Geschlecht.m, id: 3, verein: { name: "Verein3" }, altersklasse: Altersklasse.U11 },
        { name: 'Teilnehmer D', geschlecht: Geschlecht.m, id: 4, verein: { name: "Verein4" }, altersklasse: Altersklasse.U11 },
        { name: 'Teilnehmer E', geschlecht: Geschlecht.m, id: 5, verein: { name: "Verein5" }, altersklasse: Altersklasse.U11 },
        { name: 'Teilnehmer F', geschlecht: Geschlecht.w, id: 6, verein: { name: 'Verein2' }, altersklasse: Altersklasse.U11 }
      ],
      gewichtsklasse: { name: "Gewichtskl.1", gewicht: 24.8 },
      name: "Antilope"
    },
    {
      altersKlasse: Altersklasse.U11,
      gruppenGeschlecht: Geschlecht.m,
      teilnehmer: [
        { name: 'Teilnehmer G', geschlecht: Geschlecht.w, id: 7, verein: { name: 'Verein3' }, altersklasse: Altersklasse.U11 },
        { name: 'Teilnehmer H', geschlecht: Geschlecht.m, id: 8, verein: { name: 'Verein4' }, altersklasse: Altersklasse.U11 },
        { name: 'Teilnehmer I', geschlecht: Geschlecht.w, id: 9, verein: { name: 'Verein1' }, altersklasse: Altersklasse.U11 },
        { name: 'Teilnehmer J', geschlecht: Geschlecht.m, id: 10, verein: { name: 'Verein5' }, altersklasse: Altersklasse.U11 },
        { name: 'Teilnehmer K', geschlecht: Geschlecht.w, id: 11, verein: { name: 'Verein3' }, altersklasse: Altersklasse.U11 },
        { name: 'Teilnehmer L', geschlecht: Geschlecht.m, id: 12, verein: { name: 'Verein2' }, altersklasse: Altersklasse.U11 }
      ],
      gewichtsklasse: { name: "Gewichtskl.1", gewicht: 24.8 },
      name: "Eule"
    },
    {
      altersKlasse: Altersklasse.U11,
      gruppenGeschlecht: Geschlecht.m,
      teilnehmer: [
        { name: 'Teilnehmer M', geschlecht: Geschlecht.w, id: 13, verein: { name: 'Verein4' }, altersklasse: Altersklasse.U11 },
        { name: 'Teilnehmer N', geschlecht: Geschlecht.m, id: 14, verein: { name: 'Verein5' }, altersklasse: Altersklasse.U11 },
        { name: 'Teilnehmer O', geschlecht: Geschlecht.m, id: 15, verein: { name: 'Verein1' }, altersklasse: Altersklasse.U11 },
        { name: 'Teilnehmer P', geschlecht: Geschlecht.w, id: 16, verein: { name: 'Verein3' }, altersklasse: Altersklasse.U11 },
        { name: 'Teilnehmer Q', geschlecht: Geschlecht.m, id: 17, verein: { name: 'Verein2' }, altersklasse: Altersklasse.U11 },
        { name: 'Teilnehmer R', geschlecht: Geschlecht.w, id: 18, verein: { name: 'Verein1' }, altersklasse: Altersklasse.U11 }
      ],
      gewichtsklasse: { name: "Gewichtskl.1", gewicht: 24.8 },
      name: "Katze"
    },
    {
      altersKlasse: Altersklasse.U11,
      gruppenGeschlecht: Geschlecht.m,
      teilnehmer: [
        { name: 'Teilnehmer S', geschlecht: Geschlecht.m, id: 19, verein: { name: 'Verein4' }, altersklasse: Altersklasse.U11 },
        { name: 'Teilnehmer T', geschlecht: Geschlecht.w, id: 20, verein: { name: 'Verein5' }, altersklasse: Altersklasse.U11 },
        { name: 'Teilnehmer U', geschlecht: Geschlecht.m, id: 21, verein: { name: 'Verein2' }, altersklasse: Altersklasse.U11 },
        { name: 'Teilnehmer V', geschlecht: Geschlecht.w, id: 22, verein: { name: 'Verein3' }, altersklasse: Altersklasse.U11 }
      ],
      gewichtsklasse: { name: "Gewichtskl.1", gewicht: 24.8 },
      name: "Maus"
    },
    {
      altersKlasse: Altersklasse.U11,
      gruppenGeschlecht: Geschlecht.m,
      teilnehmer: [
        { name: 'Teilnehmer W', geschlecht: Geschlecht.m, id: 23, verein: { name: 'Verein1' }, altersklasse: Altersklasse.U11 },
        { name: 'Teilnehmer X', geschlecht: Geschlecht.w, id: 24, verein: { name: 'Verein4' }, altersklasse: Altersklasse.U11 },
        { name: 'Teilnehmer Y', geschlecht: Geschlecht.m, id: 25, verein: { name: 'Verein5' }, altersklasse: Altersklasse.U11 }
      ],
      gewichtsklasse: { name: "Gewichtskl.1", gewicht: 24.8 },
      name: "Tiger"
    },
  ];

  it('Simple: korrekte Anzahl an Begegnungen', () => {
    const gwks = [
      {
        altersKlasse: Altersklasse.U11,
        gruppenGeschlecht: Geschlecht.m,
        teilnehmer: [
          { name: 'Teilnehmer A', geschlecht: Geschlecht.m, id: 1, verein: { name: "Verein1" }, altersklasse: Altersklasse.U11 },
          { name: 'Teilnehmer B', geschlecht: Geschlecht.m, id: 2, verein: { name: "Verein2" }, altersklasse: Altersklasse.U11 },
          { name: 'Teilnehmer C', geschlecht: Geschlecht.m, id: 3, verein: { name: "Verein3" }, altersklasse: Altersklasse.U11 },
          { name: 'Teilnehmer D', geschlecht: Geschlecht.m, id: 4, verein: { name: "Verein4" }, altersklasse: Altersklasse.U11 },
        ],
        gewichtsklasse: { name: "Gewichtskl.1", gewicht: 24.8 },
        name: "Antilope"
      }];
    const matten = service.berechneGruppenReihenfolgeRandori(gwks, new JederGegenJeden());

    assert.equal(matten.length, 2);
    assert.equal(matten[0].runden.length, 3)
    assert.equal(matten[0].runden[0].begegnungen.length, 2)
    assert.equal(matten[0].runden[1].begegnungen.length, 2)
    assert.equal(matten[0].runden[2].begegnungen.length, 2)
    assert.equal(matten[1].runden.length, 0)
    
    const gesamtKaempfe = matten.map((matte) => matte.runden.reduce((anzahl, runde) => anzahl + runde.begegnungen.length, 0))
      .reduce((gesamt, anzahl) => gesamt + anzahl, 0);

    assert.equal(gesamtKaempfe, 6);
  });

  it('Komplex: korrekte Anzahl an Begegnungen', () => {
    const matten = service.berechneGruppenReihenfolgeRandori(gewichtsklassenGruppen, new JederGegenJeden());
    
    assert.equal(matten.length, 2);
    assert.equal(matten[0].runden.length, 5*3);
    assert.notEqual(matten[0].runden[0].begegnungen[0].wettkaempfer1, matten[0].runden[0].begegnungen[1].wettkaempfer1)
    
    var total = 0;
    for (const g of gewichtsklassenGruppen) {
      const n = g.teilnehmer.length;
      const erwarteteAnzahl = n*(n-1)*1/2;
      total += erwarteteAnzahl;
    }
    const gesamtKaempfe = matten.map((matte) => matte.runden.reduce((anzahl, runde) => anzahl + runde.begegnungen.length, 0))
      .reduce((gesamt, anzahl) => gesamt + anzahl, 0);
    assert.equal(gesamtKaempfe, total);
  });
});