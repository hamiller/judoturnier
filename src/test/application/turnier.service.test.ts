import assert from 'assert';
import { TurnierService } from '../../main/application/turnier.service';
import { Altersklasse } from '../../main/model/altersklasse';
import { Geschlecht } from '../../main/model/geschlecht';
import { JederGegenJeden } from '../../main/application/algorithm/jeder-gegen-jeden';
import { GewichtsklassenGruppe } from '../../main/model/gewichtsklassengruppe';
import { WettkampfGruppe } from '../../main/model/wettkampfgruppe';

describe('Erstellen von Begegnungen', () => {

  // ------------------------------------------------------------------
  //    Anzahl der Begegnungen berechnen: begegnungen = n*(n-1)*1/2
  // ------------------------------------------------------------------

  const service = new TurnierService();
  

  it ('Simple: korrekte Wettkampfgruppen aus Gewichtsgruppen', () => {
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
    const wettkampfGruppen = service.erstelleWettkampfgruppen(gwks, new JederGegenJeden());
    
    
    assert.equal(wettkampfGruppen.length, 1);
    assert.equal(wettkampfGruppen[0].begegnungsRunden.reduce((sum, g) => sum + g.length, 0), 6);

    // im Randori sind max 3 Kämpfe pro Matte
    assert.ok(wettkampfGruppen[0].begegnungsRunden.every(v => v.length <= 3))
  });

  it ('Komplex: korrekte Wettkampfgruppen aus Gewichtsgruppen', () => {
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

    const wettkampfGruppen = service.erstelleWettkampfgruppen(gewichtsklassenGruppen, new JederGegenJeden());
    console.log(wettkampfGruppen)
    assert.equal(wettkampfGruppen.length, 5);

    var total = 0;
    for (const g of gewichtsklassenGruppen) {
      const n = g.teilnehmer.length;
      const erwarteteAnzahl = n*(n-1)*1/2;
      total += erwarteteAnzahl;
    }
    const gesamtKaempfe = wettkampfGruppen.reduce((s, g) => s+g.begegnungsRunden.reduce((sum, g) => sum + g.length, 0), 0);
    assert.equal(gesamtKaempfe, total);

    
    // console.log(wettkampfGruppen)
    // console.log("wettkampfGruppen")
    // wettkampfGruppen.map(g => {
    //   console.log("\t gruppe\n")
    //   g.begegnungsRunden.map(bArray => {
    //     console.log("\t\t runde\n")
    //     bArray.map(b => console.log("\t\t\t" + b.wettkaempfer1.name +"-"+b.wettkaempfer2?.name))
    //   })
    // });

    // im Randori sind max 3 Kämpfe pro Matte
    assert.ok(wettkampfGruppen.every(v => v.begegnungsRunden.every(r => r.length <= 3)));
    
  });

  it('Simple: korrekte Anzahl an Begegnungen', () => {
    const wks: WettkampfGruppe[] = [
      {
        id: 100,
        name: 'Antilope',
        typ: '(Gewichtskl.1 U11)',
        begegnungsRunden: [ 
          [{wettkaempfer1: { name: 'Teilnehmer A', geschlecht: Geschlecht.m, id: 1, verein: { name: "Verein1" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer D', geschlecht: Geschlecht.m, id: 4, verein: { name: "Verein4" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer B', geschlecht: Geschlecht.m, id: 2, verein: { name: "Verein2" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer C', geschlecht: Geschlecht.m, id: 3, verein: { name: "Verein3" }, altersklasse: Altersklasse.U11 }}], 
          
          [{wettkaempfer1: { name: 'Teilnehmer D', geschlecht: Geschlecht.m, id: 4, verein: { name: "Verein4" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer C', geschlecht: Geschlecht.m, id: 3, verein: { name: "Verein3" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer A', geschlecht: Geschlecht.m, id: 1, verein: { name: "Verein1" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer B', geschlecht: Geschlecht.m, id: 2, verein: { name: "Verein2" }, altersklasse: Altersklasse.U11 }}], 
          
          [{wettkaempfer1: { name: 'Teilnehmer B', geschlecht: Geschlecht.m, id: 2, verein: { name: "Verein2" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer D', geschlecht: Geschlecht.m, id: 4, verein: { name: "Verein4" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer C', geschlecht: Geschlecht.m, id: 3, verein: { name: "Verein3" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer A', geschlecht: Geschlecht.m, id: 1, verein: { name: "Verein1" }, altersklasse: Altersklasse.U11 }}], 
        ]
      }
    ];
    const matten = service.erstelleGruppenReihenfolgeRandori(wks);

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
    const wks: WettkampfGruppe[] = [
      {
        id: 100,
        name: 'Antilope',
        typ: '(Gewichtskl.1 U11)',
        begegnungsRunden: [ 
          [{wettkaempfer1: { name: 'Teilnehmer A', geschlecht: Geschlecht.m, id: 1, verein: { name: "Verein1" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer F', geschlecht: Geschlecht.m, id: 6, verein: { name: "Verein6" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer B', geschlecht: Geschlecht.m, id: 2, verein: { name: "Verein2" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer E', geschlecht: Geschlecht.m, id: 5, verein: { name: "Verein5" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer C', geschlecht: Geschlecht.m, id: 3, verein: { name: "Verein3" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer D', geschlecht: Geschlecht.m, id: 4, verein: { name: "Verein4" }, altersklasse: Altersklasse.U11 }}], 
          
          [{wettkaempfer1: { name: 'Teilnehmer F', geschlecht: Geschlecht.m, id: 6, verein: { name: "Verein6" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer D', geschlecht: Geschlecht.m, id: 4, verein: { name: "Verein4" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer E', geschlecht: Geschlecht.m, id: 5, verein: { name: "Verein5" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer C', geschlecht: Geschlecht.m, id: 3, verein: { name: "Verein3" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer A', geschlecht: Geschlecht.m, id: 1, verein: { name: "Verein1" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer B', geschlecht: Geschlecht.m, id: 2, verein: { name: "Verein1" }, altersklasse: Altersklasse.U11 }}], 
          
          [{wettkaempfer1: { name: 'Teilnehmer B', geschlecht: Geschlecht.m, id: 2, verein: { name: "Verein2" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer F', geschlecht: Geschlecht.m, id: 6, verein: { name: "Verein6" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer C', geschlecht: Geschlecht.m, id: 3, verein: { name: "Verein3" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer A', geschlecht: Geschlecht.m, id: 1, verein: { name: "Verein1" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer D', geschlecht: Geschlecht.m, id: 4, verein: { name: "Verein4" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer E', geschlecht: Geschlecht.m, id: 5, verein: { name: "Verein5" }, altersklasse: Altersklasse.U11 }}], 

          [{wettkaempfer1: { name: 'Teilnehmer F', geschlecht: Geschlecht.m, id: 6, verein: { name: "Verein6" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer E', geschlecht: Geschlecht.m, id: 5, verein: { name: "Verein5" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer A', geschlecht: Geschlecht.m, id: 1, verein: { name: "Verein1" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer D', geschlecht: Geschlecht.m, id: 4, verein: { name: "Verein4" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer B', geschlecht: Geschlecht.m, id: 2, verein: { name: "Verein2" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer C', geschlecht: Geschlecht.m, id: 3, verein: { name: "Verein3" }, altersklasse: Altersklasse.U11 }}], 

          [{wettkaempfer1: { name: 'Teilnehmer C', geschlecht: Geschlecht.m, id: 3, verein: { name: "Verein3" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer F', geschlecht: Geschlecht.m, id: 6, verein: { name: "Verein6" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer D', geschlecht: Geschlecht.m, id: 4, verein: { name: "Verein4" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer B', geschlecht: Geschlecht.m, id: 2, verein: { name: "Verein2" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer E', geschlecht: Geschlecht.m, id: 5, verein: { name: "Verein5" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer A', geschlecht: Geschlecht.m, id: 1, verein: { name: "Verein1" }, altersklasse: Altersklasse.U11 }}], 
        ]
      },
      {
        id: 200,
        name: 'Eule',
        typ: '(Gewichtskl.1 U11)',
        begegnungsRunden: [ 
          [{wettkaempfer1: { name: 'Teilnehmer G', geschlecht: Geschlecht.m, id: 7, verein: { name: "Verein7" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer L', geschlecht: Geschlecht.m, id: 12, verein: { name: "Verein12" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer H', geschlecht: Geschlecht.m, id: 8, verein: { name: "Verein8" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer K', geschlecht: Geschlecht.m, id: 11, verein: { name: "Verein11" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer I', geschlecht: Geschlecht.m, id: 9, verein: { name: "Verein9" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer J', geschlecht: Geschlecht.m, id: 10, verein: { name: "Verein10" }, altersklasse: Altersklasse.U11 }}], 
          
          [{wettkaempfer1: { name: 'Teilnehmer L', geschlecht: Geschlecht.m, id: 12, verein: { name: "Verein12" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer J', geschlecht: Geschlecht.m, id: 10, verein: { name: "Verein10" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer K', geschlecht: Geschlecht.m, id: 11, verein: { name: "Verein11" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer I', geschlecht: Geschlecht.m, id: 9, verein: { name: "Verein9" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer G', geschlecht: Geschlecht.m, id: 7, verein: { name: "Verein7" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer H', geschlecht: Geschlecht.m, id: 8, verein: { name: "Verein8" }, altersklasse: Altersklasse.U11 }}], 
          
          [{wettkaempfer1: { name: 'Teilnehmer H', geschlecht: Geschlecht.m, id: 8, verein: { name: "Verein8" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer L', geschlecht: Geschlecht.m, id: 12, verein: { name: "Verein12" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer I', geschlecht: Geschlecht.m, id: 9, verein: { name: "Verein9" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer G', geschlecht: Geschlecht.m, id: 7, verein: { name: "Verein7" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer J', geschlecht: Geschlecht.m, id: 10, verein: { name: "Verein10" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer K', geschlecht: Geschlecht.m, id: 11, verein: { name: "Verein11" }, altersklasse: Altersklasse.U11 }}], 

          [{wettkaempfer1: { name: 'Teilnehmer L', geschlecht: Geschlecht.m, id: 12, verein: { name: "Verein12" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer K', geschlecht: Geschlecht.m, id: 11, verein: { name: "Verein11" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer G', geschlecht: Geschlecht.m, id: 7, verein: { name: "Verein7" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer J', geschlecht: Geschlecht.m, id: 10, verein: { name: "Verein10" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer H', geschlecht: Geschlecht.m, id: 8, verein: { name: "Verein8" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer I', geschlecht: Geschlecht.m, id: 9, verein: { name: "Verein9" }, altersklasse: Altersklasse.U11 }}], 

          [{wettkaempfer1: { name: 'Teilnehmer I', geschlecht: Geschlecht.m, id: 9, verein: { name: "Verein9" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer L', geschlecht: Geschlecht.m, id: 12, verein: { name: "Verein12" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer J', geschlecht: Geschlecht.m, id: 10, verein: { name: "Verein10" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer H', geschlecht: Geschlecht.m, id: 8, verein: { name: "Verein8" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer K', geschlecht: Geschlecht.m, id: 11, verein: { name: "Verein11" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer G', geschlecht: Geschlecht.m, id: 7, verein: { name: "Verein7" }, altersklasse: Altersklasse.U11 }}]
        ]
      },
      {
        id: 300,
        name: 'Katze',
        typ: '(Gewichtskl.1 U11)',
        begegnungsRunden: [
          [ {wettkaempfer1: {name: "Teilnehmer M", geschlecht: Geschlecht.m, id: 13, verein: { name: "Verein13" }, altersklasse: Altersklasse.U11 }, 
             wettkaempfer2: {name: "Teilnehmer R", geschlecht: Geschlecht.m, id: 18, verein: { name: "Verein18" }, altersklasse: Altersklasse.U11}}, 
            {wettkaempfer1: {name: "Teilnehmer N", geschlecht: Geschlecht.m, id: 14, verein: { name: "Verein14" }, altersklasse: Altersklasse.U11}, 
             wettkaempfer2: {name: "Teilnehmer Q", geschlecht: Geschlecht.m, id: 19, verein: { name: "Verein19" }, altersklasse: Altersklasse.U11}},
            {wettkaempfer1: {name: "Teilnehmer O", geschlecht: Geschlecht.m, id: 15, verein: { name: "Verein15" }, altersklasse: Altersklasse.U11}, 
             wettkaempfer2: {name: "Teilnehmer P", geschlecht: Geschlecht.m, id: 16, verein: { name: "Verein16" }, altersklasse: Altersklasse.U11}}], 
             
          [ {wettkaempfer1: {name: "Teilnehmer R", geschlecht: Geschlecht.m, id: 18, verein: { name: "Verein18" }, altersklasse: Altersklasse.U11}, 
             wettkaempfer2: {name: "Teilnehmer P", geschlecht: Geschlecht.m, id: 16, verein: { name: "Verein16" }, altersklasse: Altersklasse.U11}}, 
            {wettkaempfer1: {name: "Teilnehmer Q", geschlecht: Geschlecht.m, id: 19, verein: { name: "Verein19" }, altersklasse: Altersklasse.U11}, 
             wettkaempfer2: {name: "Teilnehmer O", geschlecht: Geschlecht.m, id: 15, verein: { name: "Verein15" }, altersklasse: Altersklasse.U11}}, 
            {wettkaempfer1: {name: "Teilnehmer M", geschlecht: Geschlecht.m, id: 13, verein: { name: "Verein13" }, altersklasse: Altersklasse.U11}, 
             wettkaempfer2: {name: "Teilnehmer N", geschlecht: Geschlecht.m, id: 14, verein: { name: "Verein14" }, altersklasse: Altersklasse.U11}}], 
             
          [ {wettkaempfer1: {name: "Teilnehmer N", geschlecht: Geschlecht.m, id: 14, verein: { name: "Verein14" }, altersklasse: Altersklasse.U11}, 
             wettkaempfer2: {name: "Teilnehmer R", geschlecht: Geschlecht.m, id: 18, verein: { name: "Verein18" }, altersklasse: Altersklasse.U11}}, 
            {wettkaempfer1: {name: "Teilnehmer O", geschlecht: Geschlecht.m, id: 15, verein: { name: "Verein15" }, altersklasse: Altersklasse.U11}, 
             wettkaempfer2: {name: "Teilnehmer M", geschlecht: Geschlecht.m, id: 13, verein: { name: "Verein13" }, altersklasse: Altersklasse.U11}},
            {wettkaempfer1: {name: "Teilnehmer P", geschlecht: Geschlecht.m, id: 16, verein: { name: "Verein16" }, altersklasse: Altersklasse.U11}, 
             wettkaempfer2: {name: "Teilnehmer Q", geschlecht: Geschlecht.m, id: 19, verein: { name: "Verein19" }, altersklasse: Altersklasse.U11}}],
            
          [ {wettkaempfer1: {name: "Teilnehmer R", geschlecht: Geschlecht.m, id: 18, verein: { name: "Verein18" }, altersklasse: Altersklasse.U11}, 
             wettkaempfer2: {name: "Teilnehmer Q", geschlecht: Geschlecht.m, id: 19, verein: { name: "Verein19" }, altersklasse: Altersklasse.U11}}, 
            {wettkaempfer1: {name: "Teilnehmer M", geschlecht: Geschlecht.m, id: 13, verein: { name: "Verein13" }, altersklasse: Altersklasse.U11}, 
             wettkaempfer2: {name: "Teilnehmer P", geschlecht: Geschlecht.m, id: 16, verein: { name: "Verein16" }, altersklasse: Altersklasse.U11}},
            {wettkaempfer1: {name: "Teilnehmer N", geschlecht: Geschlecht.m, id: 14, verein: { name: "Verein14" }, altersklasse: Altersklasse.U11}, 
             wettkaempfer2: {name: "Teilnehmer O", geschlecht: Geschlecht.m, id: 15, verein: { name: "Verein15" }, altersklasse: Altersklasse.U11}}],
            
          [ {wettkaempfer1: {name: "Teilnehmer O", geschlecht: Geschlecht.m, id: 15, verein: { name: "Verein15" }, altersklasse: Altersklasse.U11}, 
             wettkaempfer2: {name: "Teilnehmer R", geschlecht: Geschlecht.m, id: 18, verein: { name: "Verein18" }, altersklasse: Altersklasse.U11}}, 
            {wettkaempfer1: {name: "Teilnehmer P", geschlecht: Geschlecht.m, id: 16, verein: { name: "Verein16" }, altersklasse: Altersklasse.U11}, 
             wettkaempfer2: {name: "Teilnehmer N", geschlecht: Geschlecht.m, id: 14, verein: { name: "Verein14" }, altersklasse: Altersklasse.U11}},
            {wettkaempfer1: {name: "Teilnehmer Q", geschlecht: Geschlecht.m, id: 19, verein: { name: "Verein19" }, altersklasse: Altersklasse.U11}, 
             wettkaempfer2: {name: "Teilnehmer M", geschlecht: Geschlecht.m, id: 13, verein: { name: "Verein13" }, altersklasse: Altersklasse.U11}}]]
      },
      {
        id: 400,
        name: 'Maus',
        typ: '(Gewichtskl.1 U11)',
        begegnungsRunden: [ 
          [{wettkaempfer1: { name: 'Teilnehmer S', geschlecht: Geschlecht.m, id: 19, verein: { name: "Verein19" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer V', geschlecht: Geschlecht.m, id: 22, verein: { name: "Verein22" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer T', geschlecht: Geschlecht.m, id: 20, verein: { name: "Verein20" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer U', geschlecht: Geschlecht.m, id: 21, verein: { name: "Verein21" }, altersklasse: Altersklasse.U11 }}], 
          
          [{wettkaempfer1: { name: 'Teilnehmer V', geschlecht: Geschlecht.m, id: 22, verein: { name: "Verein22" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer U', geschlecht: Geschlecht.m, id: 21, verein: { name: "Verein21" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer S', geschlecht: Geschlecht.m, id: 19, verein: { name: "Verein19" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer T', geschlecht: Geschlecht.m, id: 20, verein: { name: "Verein20" }, altersklasse: Altersklasse.U11 }}], 
          
          [{wettkaempfer1: { name: 'Teilnehmer T', geschlecht: Geschlecht.m, id: 20, verein: { name: "Verein20" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer V', geschlecht: Geschlecht.m, id: 22, verein: { name: "Verein22" }, altersklasse: Altersklasse.U11 }},
           {wettkaempfer1: { name: 'Teilnehmer U', geschlecht: Geschlecht.m, id: 21, verein: { name: "Verein21" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer S', geschlecht: Geschlecht.m, id: 19, verein: { name: "Verein19" }, altersklasse: Altersklasse.U11 }}]]
      },
      {
        id: 500,
        name: 'Tiger',
        typ: '(Gewichtskl.1 U11)',
        begegnungsRunden: [ 
          [{wettkaempfer1: { name: 'Teilnehmer X', geschlecht: Geschlecht.m, id: 24, verein: { name: "Verein24" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer Y', geschlecht: Geschlecht.m, id: 25, verein: { name: "Verein25" }, altersklasse: Altersklasse.U11 }}], 
          
          [{wettkaempfer1: { name: 'Teilnehmer W', geschlecht: Geschlecht.m, id: 23, verein: { name: "Verein23" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer X', geschlecht: Geschlecht.m, id: 24, verein: { name: "Verein24" }, altersklasse: Altersklasse.U11 }}], 
          
          [{wettkaempfer1: { name: 'Teilnehmer Y', geschlecht: Geschlecht.m, id: 25, verein: { name: "Verein25" }, altersklasse: Altersklasse.U11 },
            wettkaempfer2: { name: 'Teilnehmer W', geschlecht: Geschlecht.m, id: 23, verein: { name: "Verein23" }, altersklasse: Altersklasse.U11 }}]]
      }
    ];
    const matten = service.erstelleGruppenReihenfolgeRandori(wks);
    
    assert.equal(matten.length, 2);
    
    var total = 0;
    for (const g of wks) {
      const w = new Set()
      g.begegnungsRunden.map(ra => ra.map(r => {
        w.add(r.wettkaempfer1.name)
        w.add(r.wettkaempfer2!.name)
      }))
      const n = w.size;
      const erwarteteAnzahl = n*(n-1)*1/2;
      total += erwarteteAnzahl;
    }
    const gesamtKaempfe = matten.map((matte) => matte.runden.reduce((anzahl, runde) => anzahl + runde.begegnungen.length, 0))
      .reduce((gesamt, anzahl) => gesamt + anzahl, 0);
    assert.equal(gesamtKaempfe, total);
  });
});