import assert from 'assert';
import { JederGegenJeden } from '../../main/application/algorithm/jeder-gegen-jeden';
import { TurnierService } from '../../main/application/turnier.service';
import { Hilfsdaten } from './hilfsdaten';
import { WettkampfReihenfolge } from '../../main/model/einstellungen';

describe('Erstellen von Begegnungen', () => {

  // ------------------------------------------------------------------
  //    Anzahl der Begegnungen berechnen: begegnungen = n*(n-1)*1/2
  // ------------------------------------------------------------------

  const service = new TurnierService();

  it ('Simple: korrekte Wettkampfgruppen aus Gewichtsgruppen', () => {
    const wettkampfGruppen = service.erstelleWettkampfgruppen(Hilfsdaten.gwks2, new JederGegenJeden(), 2);
    
    assert.equal(wettkampfGruppen.length, 1);
    assert.equal(wettkampfGruppen[0].alleGruppenBegegnungen.reduce((sum, g) => sum + g.length, 0), 6);

    // im Randori sind max 3 Kämpfe pro Matte
    assert.ok(wettkampfGruppen[0].alleGruppenBegegnungen.every(v => v.length <= 3));
  });

  it ('Komplex: korrekte Wettkampfgruppen aus Gewichtsgruppen', () => {    
    const wettkampfGruppen = service.erstelleWettkampfgruppen(Hilfsdaten.gewichtsklassenGruppen, new JederGegenJeden(), 2);
    
    console.log(wettkampfGruppen);
    assert.equal(wettkampfGruppen.length, 5);

    let total = 0;
    for (const g of Hilfsdaten.gewichtsklassenGruppen) {
      const n = g.teilnehmer.length;
      const erwarteteAnzahl = n*(n-1)*1/2;
      total += erwarteteAnzahl;
    }
    const gesamtKaempfe = wettkampfGruppen.reduce((s, g) => s+g.alleGruppenBegegnungen.reduce((sum, g) => sum + g.length, 0), 0);
    assert.equal(gesamtKaempfe, total);

    
    console.log(wettkampfGruppen);
    console.log("wettkampfGruppen");
    wettkampfGruppen.map(g => {
      console.log("\t gruppe\n");
      g.alleGruppenBegegnungen.map(bArray => {
        console.log("\t\t runde\n");
        bArray.map(b => console.log("\t\t\t" + b.wettkaempfer1.name +"-"+b.wettkaempfer2?.name));
      });
    });

    // im Randori sind max 3 Kämpfe pro Matte
    assert.ok(wettkampfGruppen.every(v => v.alleGruppenBegegnungen.every(r => r.length <= 3)));
    
  });

  it('Simple: korrekte Anzahl an Begegnungen, WettkampfReihenfolge.abwechselnd', () => {
    const matten = service.erstelleGruppenReihenfolgeRandori(Hilfsdaten.wks2, 2, WettkampfReihenfolge.abwechselnd);

    assert.equal(matten.length, 2);
    assert.equal(matten[0].runden.length, 3);
    assert.equal(matten[0].runden[0].begegnungen.length, 2);
    assert.equal(matten[0].runden[1].begegnungen.length, 2);
    assert.equal(matten[0].runden[2].begegnungen.length, 2);
    assert.equal(matten[1].runden.length, 0);
    
    const gesamtKaempfe = matten.map((matte) => matte.runden.reduce((anzahl, runde) => anzahl + runde.begegnungen.length, 0))
      .reduce((gesamt, anzahl) => gesamt + anzahl, 0);

    assert.equal(gesamtKaempfe, 6);
  });

  it('Komplex: korrekte Anzahl an Begegnungen, WettkampfReihenfolge.abwechselnd', () => {
    const matten = service.erstelleGruppenReihenfolgeRandori(Hilfsdaten.wks, 2, WettkampfReihenfolge.abwechselnd);
    
    assert.equal(matten.length, 2);
    
    let total = 0;
    for (const g of Hilfsdaten.wks) {
      const w = new Set();
      g.alleGruppenBegegnungen.map(ra => ra.map(r => {
        w.add(r.wettkaempfer1.name);
        w.add(r.wettkaempfer2!.name);
      }));
      const n = w.size;
      const erwarteteAnzahl = n*(n-1)*1/2;
      total += erwarteteAnzahl;
    }
    const gesamtKaempfe = matten.map((matte) => matte.runden.reduce((anzahl, runde) => anzahl + runde.begegnungen.length, 0))
      .reduce((gesamt, anzahl) => gesamt + anzahl, 0);
    assert.equal(gesamtKaempfe, total);
  });

  it('Reihenfolge der Gruppen ungerade Anzahl, WettkampfReihenfolge.abwechselnd', () => {
    const matten = service.erstelleGruppenReihenfolgeRandori(Hilfsdaten.wks, 2, WettkampfReihenfolge.abwechselnd);
    
    assert.equal(matten.length, 2);
    
    let total = 0;
    for (const g of Hilfsdaten.wks) {
      const w = new Set();
      g.alleGruppenBegegnungen.map(ra => ra.map(r => {
        w.add(r.wettkaempfer1.name);
        w.add(r.wettkaempfer2!.name);
      }));
      const n = w.size;
      const erwarteteAnzahl = n*(n-1)*1/2;
      total += erwarteteAnzahl;
    }
    const gesamtKaempfe = matten.map((matte) => matte.runden.reduce((anzahl, runde) => anzahl + runde.begegnungen.length, 0))
      .reduce((gesamt, anzahl) => gesamt + anzahl, 0);
    assert.equal(gesamtKaempfe, total);
  });

  it('Reihenfolge der Gruppen gerade Anzahl, WettkampfReihenfolge.abwechselnd, wegen Ungleichgewicht mit 2 Pausen', () => {
    const data = Hilfsdaten.wks_gerade;
    const mattenZahl = 1;
    const matten = service.erstelleGruppenReihenfolgeRandori(data, mattenZahl, WettkampfReihenfolge.abwechselnd);
    
    assert.equal(matten.length, mattenZahl);
    
    let total = 0;
    for (const g of data) {
      const w = new Set();
      g.alleGruppenBegegnungen.map(ra => ra.map(r => {
        w.add(r.wettkaempfer1.name);
        w.add(r.wettkaempfer2!.name);
      }));
      const n = w.size;
      const erwarteteAnzahl = n*(n-1)*1/2;
      total += erwarteteAnzahl;
    }
    total += 2; // plus 2 Pausen
    const gesamtKaempfe = matten.map((matte) => matte.runden.reduce((anzahl, runde) => anzahl + runde.begegnungen.length, 0))
      .reduce((gesamt, anzahl) => gesamt + anzahl, 0);
    assert.equal(gesamtKaempfe, total);
  });


  it('Reihenfolge der Gruppen unterschiedlich viele Begegnungen, WettkampfReihenfolge.abwechselnd, wegen Ungleichgewicht mit 4 Pausen', () => {
    const data = Hilfsdaten.wks_gerade_unterschiedlich;
    const mattenZahl = 1;
    const matten = service.erstelleGruppenReihenfolgeRandori(data, mattenZahl, WettkampfReihenfolge.abwechselnd);
    
    assert.equal(matten.length, mattenZahl);
    
    let total = 0;
    for (const g of data) {
      const w = new Set();
      g.alleGruppenBegegnungen.map(ra => ra.map(r => {
        w.add(r.wettkaempfer1.name);
        w.add(r.wettkaempfer2!.name);
      }));
      const n = w.size;
      const erwarteteAnzahl = n*(n-1)*1/2;
      total += erwarteteAnzahl;
    }
    total += 4; // plus 4 Pausen
    const gesamtKaempfe = matten.map((matte) => matte.runden.reduce((anzahl, runde) => anzahl + runde.begegnungen.length, 0))
      .reduce((gesamt, anzahl) => gesamt + anzahl, 0);
    assert.equal(gesamtKaempfe, total);
  });


  it('Simple: korrekte Anzahl an Begegnungen, WettkampfReihenfolge.alle', () => {
    const matten = service.erstelleGruppenReihenfolgeRandori(Hilfsdaten.wks2, 2, WettkampfReihenfolge.alle);

    assert.equal(matten.length, 2);
    assert.equal(matten[0].runden.length, 3);
    assert.equal(matten[0].runden[0].begegnungen.length, 2);
    assert.equal(matten[0].runden[1].begegnungen.length, 2);
    assert.equal(matten[0].runden[2].begegnungen.length, 2);
    assert.equal(matten[1].runden.length, 0);
    
    const gesamtKaempfe = matten.map((matte) => matte.runden.reduce((anzahl, runde) => anzahl + runde.begegnungen.length, 0))
      .reduce((gesamt, anzahl) => gesamt + anzahl, 0);

    assert.equal(gesamtKaempfe, 6);
  });

  it('Komplex: korrekte Anzahl an Begegnungen, WettkampfReihenfolge.alle', () => {
    const matten = service.erstelleGruppenReihenfolgeRandori(Hilfsdaten.wks, 2, WettkampfReihenfolge.alle);
    
    assert.equal(matten.length, 2);
    
    let total = 0;
    for (const g of Hilfsdaten.wks) {
      const w = new Set();
      g.alleGruppenBegegnungen.map(ra => ra.map(r => {
        w.add(r.wettkaempfer1.name);
        w.add(r.wettkaempfer2!.name);
      }));
      const n = w.size;
      const erwarteteAnzahl = n*(n-1)*1/2;
      total += erwarteteAnzahl;
    }
    const gesamtKaempfe = matten.map((matte) => matte.runden.reduce((anzahl, runde) => anzahl + runde.begegnungen.length, 0))
      .reduce((gesamt, anzahl) => gesamt + anzahl, 0);
    assert.equal(gesamtKaempfe, total);
  });

  it('Reihenfolge der Gruppen ungerade Anzahl, WettkampfReihenfolge.alle', () => {
    const matten = service.erstelleGruppenReihenfolgeRandori(Hilfsdaten.wks, 2, WettkampfReihenfolge.alle);
    
    assert.equal(matten.length, 2);
    
    let total = 0;
    for (const g of Hilfsdaten.wks) {
      const w = new Set();
      g.alleGruppenBegegnungen.map(ra => ra.map(r => {
        w.add(r.wettkaempfer1.name);
        w.add(r.wettkaempfer2!.name);
      }));
      const n = w.size;
      const erwarteteAnzahl = n*(n-1)*1/2;
      total += erwarteteAnzahl;
    }
    const gesamtKaempfe = matten.map((matte) => matte.runden.reduce((anzahl, runde) => anzahl + runde.begegnungen.length, 0))
      .reduce((gesamt, anzahl) => gesamt + anzahl, 0);
    assert.equal(gesamtKaempfe, total);
  });

  it('Reihenfolge der Gruppen gerade Anzahl, WettkampfReihenfolge.alle', () => {
    const data = Hilfsdaten.wks_gerade;
    const mattenZahl = 1;
    const matten = service.erstelleGruppenReihenfolgeRandori(data, mattenZahl, WettkampfReihenfolge.alle);
    
    assert.equal(matten.length, mattenZahl);
    
    let total = 0;
    for (const g of data) {
      const w = new Set();
      g.alleGruppenBegegnungen.map(ra => ra.map(r => {
        w.add(r.wettkaempfer1.name);
        w.add(r.wettkaempfer2!.name);
      }));
      const n = w.size;
      const erwarteteAnzahl = n*(n-1)*1/2;
      total += erwarteteAnzahl;
    }
    const gesamtKaempfe = matten.map((matte) => matte.runden.reduce((anzahl, runde) => anzahl + runde.begegnungen.length, 0))
      .reduce((gesamt, anzahl) => gesamt + anzahl, 0);
    assert.equal(gesamtKaempfe, total);
  });


  it('Reihenfolge der Gruppen unterschiedlich viele Begegnungen, WettkampfReihenfolge.alle', () => {
    const data = Hilfsdaten.wks_gerade_unterschiedlich;
    const mattenZahl = 1;
    const matten = service.erstelleGruppenReihenfolgeRandori(data, mattenZahl, WettkampfReihenfolge.alle);
    
    assert.equal(matten.length, mattenZahl);
    
    let total = 0;
    for (const g of data) {
      const w = new Set();
      g.alleGruppenBegegnungen.map(ra => ra.map(r => {
        w.add(r.wettkaempfer1.name);
        w.add(r.wettkaempfer2!.name);
      }));
      const n = w.size;
      const erwarteteAnzahl = n*(n-1)*1/2;
      total += erwarteteAnzahl;
    }
    const gesamtKaempfe = matten.map((matte) => matte.runden.reduce((anzahl, runde) => anzahl + runde.begegnungen.length, 0))
      .reduce((gesamt, anzahl) => gesamt + anzahl, 0);
    assert.equal(gesamtKaempfe, total);
  });
});