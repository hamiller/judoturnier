import assert from 'assert';
import { JederGegenJeden } from '../../../main/application/algorithm/jeder-gegen-jeden';
import { Altersklasse } from '../../../main/model/altersklasse';
import { Geschlecht } from '../../../main/model/geschlecht';
import { Wettkaempfer } from '../../../main/model/wettkaempfer';
import { GewichtsklassenGruppe } from '../../../main/model/gewichtsklassengruppe';

describe('Erstellen von Wettkampfgruppen', () => {
  const algorithmus = new JederGegenJeden();
  const teilnehmer: Wettkaempfer[] = [
    { name: 'Teilnehmer A', geschlecht: Geschlecht.m, id: 1, verein: { name: "Verein1" }, altersklasse: Altersklasse.U11 , checked: true, printed: true},
    { name: 'Teilnehmer B', geschlecht: Geschlecht.m, id: 2, verein: { name: "Verein2" }, altersklasse: Altersklasse.U11 , checked: true, printed: true},
    { name: 'Teilnehmer C', geschlecht: Geschlecht.m, id: 3, verein: { name: "Verein3" }, altersklasse: Altersklasse.U11 , checked: true, printed: true},
    { name: 'Teilnehmer D', geschlecht: Geschlecht.m, id: 4, verein: { name: "Verein4" }, altersklasse: Altersklasse.U11 , checked: true, printed: true},
    { name: 'Teilnehmer E', geschlecht: Geschlecht.m, id: 5, verein: { name: "Verein5" }, altersklasse: Altersklasse.U11 , checked: true, printed: true},
    { name: 'Teilnehmer F', geschlecht: Geschlecht.w, id: 6, verein: { name: 'Verein2' }, altersklasse: Altersklasse.U11 , checked: true, printed: true},
    { name: 'Teilnehmer G', geschlecht: Geschlecht.w, id: 7, verein: { name: 'Verein3' }, altersklasse: Altersklasse.U11 , checked: true, printed: true},
    { name: 'Teilnehmer H', geschlecht: Geschlecht.m, id: 8, verein: { name: 'Verein4' }, altersklasse: Altersklasse.U11 , checked: true, printed: true},
    { name: 'Teilnehmer I', geschlecht: Geschlecht.w, id: 9, verein: { name: 'Verein1' }, altersklasse: Altersklasse.U11 , checked: true, printed: true},
    { name: 'Teilnehmer J', geschlecht: Geschlecht.m, id: 10, verein: { name: 'Verein5' }, altersklasse: Altersklasse.U11, checked: true, printed: true },
    { name: 'Teilnehmer K', geschlecht: Geschlecht.w, id: 11, verein: { name: 'Verein3' }, altersklasse: Altersklasse.U11, checked: true, printed: true },
    { name: 'Teilnehmer L', geschlecht: Geschlecht.m, id: 12, verein: { name: 'Verein2' }, altersklasse: Altersklasse.U11, checked: true, printed: true },
    { name: 'Teilnehmer M', geschlecht: Geschlecht.w, id: 13, verein: { name: 'Verein4' }, altersklasse: Altersklasse.U11, checked: true, printed: true },
    { name: 'Teilnehmer N', geschlecht: Geschlecht.m, id: 14, verein: { name: 'Verein5' }, altersklasse: Altersklasse.U11, checked: true, printed: true },
    { name: 'Teilnehmer O', geschlecht: Geschlecht.m, id: 15, verein: { name: 'Verein1' }, altersklasse: Altersklasse.U11, checked: true, printed: true },
    { name: 'Teilnehmer P', geschlecht: Geschlecht.w, id: 16, verein: { name: 'Verein3' }, altersklasse: Altersklasse.U11, checked: true, printed: true },
    { name: 'Teilnehmer Q', geschlecht: Geschlecht.m, id: 17, verein: { name: 'Verein2' }, altersklasse: Altersklasse.U11, checked: true, printed: true },
    { name: 'Teilnehmer R', geschlecht: Geschlecht.w, id: 18, verein: { name: 'Verein1' }, altersklasse: Altersklasse.U11, checked: true, printed: true },
    { name: 'Teilnehmer S', geschlecht: Geschlecht.m, id: 19, verein: { name: 'Verein4' }, altersklasse: Altersklasse.U11, checked: true, printed: true },
    { name: 'Teilnehmer T', geschlecht: Geschlecht.w, id: 20, verein: { name: 'Verein5' }, altersklasse: Altersklasse.U11, checked: true, printed: true },
    { name: 'Teilnehmer U', geschlecht: Geschlecht.m, id: 21, verein: { name: 'Verein2' }, altersklasse: Altersklasse.U11, checked: true, printed: true },
    { name: 'Teilnehmer V', geschlecht: Geschlecht.w, id: 22, verein: { name: 'Verein3' }, altersklasse: Altersklasse.U11, checked: true, printed: true },
    { name: 'Teilnehmer W', geschlecht: Geschlecht.m, id: 23, verein: { name: 'Verein1' }, altersklasse: Altersklasse.U11, checked: true, printed: true },
    { name: 'Teilnehmer X', geschlecht: Geschlecht.w, id: 24, verein: { name: 'Verein4' }, altersklasse: Altersklasse.U11, checked: true, printed: true },
    { name: 'Teilnehmer Y', geschlecht: Geschlecht.m, id: 25, verein: { name: 'Verein5' }, altersklasse: Altersklasse.U11, checked: true, printed: true }
  ];
  const gewichtsklassenGruppe: GewichtsklassenGruppe = {
    id: 1,
    altersKlasse: Altersklasse.U11,
    gruppenGeschlecht: Geschlecht.m,
    teilnehmer: teilnehmer,
    maxGewicht: 26.9,
    minGewicht: 24.8,
    name: "GewichtsGruppenname - Die Leichten"
  };

  it('Gruppen korrekt erstellt', () => {
    const erstellteWettkampfgruppen = algorithmus.erstelleWettkampfGruppen(1, gewichtsklassenGruppe, 10);
    
    // erstellteWettkampfgruppen.forEach(gruppe => {
    //   console.log("Gruppe", gruppe.id);
    //   gruppe.begegnungen.forEach(runde => {
    //     console.log("Runde");
    //     runde.forEach(p => console.log(p.wettkaempfer1.name + "=>" + p.wettkaempfer2?.name));
    //   })
    // });
    
    assert.notEqual(erstellteWettkampfgruppen[0].alleGruppenBegegnungen[0][0].wettkaempfer1.id, erstellteWettkampfgruppen[0].alleGruppenBegegnungen[1][0].wettkaempfer1.id);
    assert(erstellteWettkampfgruppen[0].alleGruppenBegegnungen[0].length == 3);
  });
});