import assert from 'assert';
import { Sortierer } from '../main/application/sortierer';
import { Altersklasse } from '../main/model/altersklasse';
import { Begegnung } from '../main/model/begegnung';
import { Geschlecht } from '../main/model/geschlecht';
import { Wettkaempfer } from '../main/model/wettkaempfer';


describe('Sortierung von Begegnungen', () => {
  const sortierer = new Sortierer();
  
  it('korrekte ', () => {
    const teilnehmer: Wettkaempfer[] = [
      { name: 'Teilnehmer A', geschlecht: Geschlecht.m, id: 1,verein: {name: "Verein1"}, altersklasse: Altersklasse.U11 },
      { name: 'Teilnehmer B', geschlecht: Geschlecht.m, id: 1,verein: {name: "Verein1"}, altersklasse: Altersklasse.U11 },
      { name: 'Teilnehmer C', geschlecht: Geschlecht.m, id: 1,verein: {name: "Verein1"}, altersklasse: Altersklasse.U11 },
      { name: 'Teilnehmer D', geschlecht: Geschlecht.m, id: 1,verein: {name: "Verein1"}, altersklasse: Altersklasse.U11 },
      { name: 'Teilnehmer E', geschlecht: Geschlecht.m, id: 1,verein: {name: "Verein1"}, altersklasse: Altersklasse.U11 }
    ];

    const begegnungen: Begegnung[] = [
      { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[1] },
      { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[2] },
      { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[3] },
      { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[4] },
      { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[2] },
      { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[3] },
      { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[4] },
      { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[3] },
      { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[4] },
      { wettkaempfer1: teilnehmer[3], wettkaempfer2: teilnehmer[4] },
    ];
    const sortiereBegegnungen = sortierer.sortiereBegegnungen(begegnungen);
    
    assert.notStrictEqual(sortiereBegegnungen[0].wettkaempfer1, sortiereBegegnungen[1].wettkaempfer1)
  });
});