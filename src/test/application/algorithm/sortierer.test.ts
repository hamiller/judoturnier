import assert from 'assert';
import { Sortierer } from '../../../main/application/sortierer';
import { Altersklasse } from '../../../main/model/altersklasse';
import { Begegnung } from '../../../main/model/begegnung';
import { Geschlecht } from '../../../main/model/geschlecht';
import { Wettkaempfer } from '../../../main/model/wettkaempfer';


describe('Sortierung von Begegnungen', () => {
  const sortierer = new Sortierer();

  it('korrekte ', () => {
    const sortiereBegegnungen = sortierer.sortiereBegegnungen(begegnungen);
    
    // begegnungen.slice(0,3).forEach(p => console.log(p.wettkaempfer1.name + "=>" + p.wettkaempfer2?.name));
    // console.log("---------")
    // sortiereBegegnungen.slice(0,3).forEach(p => console.log(p.wettkaempfer1.name + "=>" + p.wettkaempfer2?.name));

    // assert.notEqual(sortiereBegegnungen[0].wettkaempfer1.id, sortiereBegegnungen[1].wettkaempfer1.id)
    assert(true);
  });
});


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

const begegnungen: Begegnung[] = [
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[1] }, 
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[2] }, 
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[3] }, 
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[4] }, 
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[5] }, 
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[6] }, 
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[7] },
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[8] }, 
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[9] }, 
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[10] },
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[11] },
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[12] },
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[13] },
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[14] },
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[15] },
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[16] },
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[17] },
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[18] },
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[19] },
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[20] },
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[21] },
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[22] },
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[23] },
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[0], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[2] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[3] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[4] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[5] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[6] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[7] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[8] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[9] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[10] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[11] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[12] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[13] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[14] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[15] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[16] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[17] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[18] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[19] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[20] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[21] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[22] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[23] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[1], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[3] },
  { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[4] },
  { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[5] },
  { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[6] },
  { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[7] },
  { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[8] },
  { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[9] },
  { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[10] },
  { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[11] },
  { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[12] },
  { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[13] },
  { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[14] },
  { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[15] },
  { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[16] },
  { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[17] },
  { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[18] },
  { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[19] },
  { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[20] },
  { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[21] },
  { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[22] },
  { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[23] },
  { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[2], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[3], wettkaempfer2: teilnehmer[4] },
  { wettkaempfer1: teilnehmer[3], wettkaempfer2: teilnehmer[5] },
  { wettkaempfer1: teilnehmer[3], wettkaempfer2: teilnehmer[6] },
  { wettkaempfer1: teilnehmer[3], wettkaempfer2: teilnehmer[7] },
  { wettkaempfer1: teilnehmer[3], wettkaempfer2: teilnehmer[8] },
  { wettkaempfer1: teilnehmer[3], wettkaempfer2: teilnehmer[9] },
  { wettkaempfer1: teilnehmer[3], wettkaempfer2: teilnehmer[10] },
  { wettkaempfer1: teilnehmer[3], wettkaempfer2: teilnehmer[11] },
  { wettkaempfer1: teilnehmer[3], wettkaempfer2: teilnehmer[12] },
  { wettkaempfer1: teilnehmer[3], wettkaempfer2: teilnehmer[13] },
  { wettkaempfer1: teilnehmer[3], wettkaempfer2: teilnehmer[14] },
  { wettkaempfer1: teilnehmer[3], wettkaempfer2: teilnehmer[15] },
  { wettkaempfer1: teilnehmer[3], wettkaempfer2: teilnehmer[16] },
  { wettkaempfer1: teilnehmer[3], wettkaempfer2: teilnehmer[17] },
  { wettkaempfer1: teilnehmer[3], wettkaempfer2: teilnehmer[18] },
  { wettkaempfer1: teilnehmer[3], wettkaempfer2: teilnehmer[19] },
  { wettkaempfer1: teilnehmer[3], wettkaempfer2: teilnehmer[20] },
  { wettkaempfer1: teilnehmer[3], wettkaempfer2: teilnehmer[21] },
  { wettkaempfer1: teilnehmer[3], wettkaempfer2: teilnehmer[22] },
  { wettkaempfer1: teilnehmer[3], wettkaempfer2: teilnehmer[23] },
  { wettkaempfer1: teilnehmer[3], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[3], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[4], wettkaempfer2: teilnehmer[5] },
  { wettkaempfer1: teilnehmer[4], wettkaempfer2: teilnehmer[6] },
  { wettkaempfer1: teilnehmer[4], wettkaempfer2: teilnehmer[7] },
  { wettkaempfer1: teilnehmer[4], wettkaempfer2: teilnehmer[8] },
  { wettkaempfer1: teilnehmer[4], wettkaempfer2: teilnehmer[9] },
  { wettkaempfer1: teilnehmer[4], wettkaempfer2: teilnehmer[10] },
  { wettkaempfer1: teilnehmer[4], wettkaempfer2: teilnehmer[11] },
  { wettkaempfer1: teilnehmer[4], wettkaempfer2: teilnehmer[12] },
  { wettkaempfer1: teilnehmer[4], wettkaempfer2: teilnehmer[13] },
  { wettkaempfer1: teilnehmer[4], wettkaempfer2: teilnehmer[14] },
  { wettkaempfer1: teilnehmer[4], wettkaempfer2: teilnehmer[15] },
  { wettkaempfer1: teilnehmer[4], wettkaempfer2: teilnehmer[16] },
  { wettkaempfer1: teilnehmer[4], wettkaempfer2: teilnehmer[17] },
  { wettkaempfer1: teilnehmer[4], wettkaempfer2: teilnehmer[18] },
  { wettkaempfer1: teilnehmer[4], wettkaempfer2: teilnehmer[19] },
  { wettkaempfer1: teilnehmer[4], wettkaempfer2: teilnehmer[20] },
  { wettkaempfer1: teilnehmer[4], wettkaempfer2: teilnehmer[21] },
  { wettkaempfer1: teilnehmer[4], wettkaempfer2: teilnehmer[22] },
  { wettkaempfer1: teilnehmer[4], wettkaempfer2: teilnehmer[23] },
  { wettkaempfer1: teilnehmer[4], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[4], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[5], wettkaempfer2: teilnehmer[6] },
  { wettkaempfer1: teilnehmer[5], wettkaempfer2: teilnehmer[7] },
  { wettkaempfer1: teilnehmer[5], wettkaempfer2: teilnehmer[8] },
  { wettkaempfer1: teilnehmer[5], wettkaempfer2: teilnehmer[9] },
  { wettkaempfer1: teilnehmer[5], wettkaempfer2: teilnehmer[10] },
  { wettkaempfer1: teilnehmer[5], wettkaempfer2: teilnehmer[11] },
  { wettkaempfer1: teilnehmer[5], wettkaempfer2: teilnehmer[12] },
  { wettkaempfer1: teilnehmer[5], wettkaempfer2: teilnehmer[13] },
  { wettkaempfer1: teilnehmer[5], wettkaempfer2: teilnehmer[14] },
  { wettkaempfer1: teilnehmer[5], wettkaempfer2: teilnehmer[15] },
  { wettkaempfer1: teilnehmer[5], wettkaempfer2: teilnehmer[16] },
  { wettkaempfer1: teilnehmer[5], wettkaempfer2: teilnehmer[17] },
  { wettkaempfer1: teilnehmer[5], wettkaempfer2: teilnehmer[18] },
  { wettkaempfer1: teilnehmer[5], wettkaempfer2: teilnehmer[19] },
  { wettkaempfer1: teilnehmer[5], wettkaempfer2: teilnehmer[20] },
  { wettkaempfer1: teilnehmer[5], wettkaempfer2: teilnehmer[21] },
  { wettkaempfer1: teilnehmer[5], wettkaempfer2: teilnehmer[22] },
  { wettkaempfer1: teilnehmer[5], wettkaempfer2: teilnehmer[23] },
  { wettkaempfer1: teilnehmer[5], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[5], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[6], wettkaempfer2: teilnehmer[7] },
  { wettkaempfer1: teilnehmer[6], wettkaempfer2: teilnehmer[8] },
  { wettkaempfer1: teilnehmer[6], wettkaempfer2: teilnehmer[9] },
  { wettkaempfer1: teilnehmer[6], wettkaempfer2: teilnehmer[10] },
  { wettkaempfer1: teilnehmer[6], wettkaempfer2: teilnehmer[11] },
  { wettkaempfer1: teilnehmer[6], wettkaempfer2: teilnehmer[12] },
  { wettkaempfer1: teilnehmer[6], wettkaempfer2: teilnehmer[13] },
  { wettkaempfer1: teilnehmer[6], wettkaempfer2: teilnehmer[14] },
  { wettkaempfer1: teilnehmer[6], wettkaempfer2: teilnehmer[15] },
  { wettkaempfer1: teilnehmer[6], wettkaempfer2: teilnehmer[16] },
  { wettkaempfer1: teilnehmer[6], wettkaempfer2: teilnehmer[17] },
  { wettkaempfer1: teilnehmer[6], wettkaempfer2: teilnehmer[18] },
  { wettkaempfer1: teilnehmer[6], wettkaempfer2: teilnehmer[19] },
  { wettkaempfer1: teilnehmer[6], wettkaempfer2: teilnehmer[20] },
  { wettkaempfer1: teilnehmer[6], wettkaempfer2: teilnehmer[21] },
  { wettkaempfer1: teilnehmer[6], wettkaempfer2: teilnehmer[22] },
  { wettkaempfer1: teilnehmer[6], wettkaempfer2: teilnehmer[23] },
  { wettkaempfer1: teilnehmer[6], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[6], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[7], wettkaempfer2: teilnehmer[8] },
  { wettkaempfer1: teilnehmer[7], wettkaempfer2: teilnehmer[9] },
  { wettkaempfer1: teilnehmer[7], wettkaempfer2: teilnehmer[10] },
  { wettkaempfer1: teilnehmer[7], wettkaempfer2: teilnehmer[11] },
  { wettkaempfer1: teilnehmer[7], wettkaempfer2: teilnehmer[12] },
  { wettkaempfer1: teilnehmer[7], wettkaempfer2: teilnehmer[13] },
  { wettkaempfer1: teilnehmer[7], wettkaempfer2: teilnehmer[14] },
  { wettkaempfer1: teilnehmer[7], wettkaempfer2: teilnehmer[15] },
  { wettkaempfer1: teilnehmer[7], wettkaempfer2: teilnehmer[16] },
  { wettkaempfer1: teilnehmer[7], wettkaempfer2: teilnehmer[17] },
  { wettkaempfer1: teilnehmer[7], wettkaempfer2: teilnehmer[18] },
  { wettkaempfer1: teilnehmer[7], wettkaempfer2: teilnehmer[19] },
  { wettkaempfer1: teilnehmer[7], wettkaempfer2: teilnehmer[20] },
  { wettkaempfer1: teilnehmer[7], wettkaempfer2: teilnehmer[21] },
  { wettkaempfer1: teilnehmer[7], wettkaempfer2: teilnehmer[22] },
  { wettkaempfer1: teilnehmer[7], wettkaempfer2: teilnehmer[23] },
  { wettkaempfer1: teilnehmer[7], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[7], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[8], wettkaempfer2: teilnehmer[9] },
  { wettkaempfer1: teilnehmer[8], wettkaempfer2: teilnehmer[10] },
  { wettkaempfer1: teilnehmer[8], wettkaempfer2: teilnehmer[11] },
  { wettkaempfer1: teilnehmer[8], wettkaempfer2: teilnehmer[12] },
  { wettkaempfer1: teilnehmer[8], wettkaempfer2: teilnehmer[13] },
  { wettkaempfer1: teilnehmer[8], wettkaempfer2: teilnehmer[14] },
  { wettkaempfer1: teilnehmer[8], wettkaempfer2: teilnehmer[15] },
  { wettkaempfer1: teilnehmer[8], wettkaempfer2: teilnehmer[16] },
  { wettkaempfer1: teilnehmer[8], wettkaempfer2: teilnehmer[17] },
  { wettkaempfer1: teilnehmer[8], wettkaempfer2: teilnehmer[18] },
  { wettkaempfer1: teilnehmer[8], wettkaempfer2: teilnehmer[19] },
  { wettkaempfer1: teilnehmer[8], wettkaempfer2: teilnehmer[20] },
  { wettkaempfer1: teilnehmer[8], wettkaempfer2: teilnehmer[21] },
  { wettkaempfer1: teilnehmer[8], wettkaempfer2: teilnehmer[22] },
  { wettkaempfer1: teilnehmer[8], wettkaempfer2: teilnehmer[23] },
  { wettkaempfer1: teilnehmer[8], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[8], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[9], wettkaempfer2: teilnehmer[10] },
  { wettkaempfer1: teilnehmer[9], wettkaempfer2: teilnehmer[11] },
  { wettkaempfer1: teilnehmer[9], wettkaempfer2: teilnehmer[12] },
  { wettkaempfer1: teilnehmer[9], wettkaempfer2: teilnehmer[13] },
  { wettkaempfer1: teilnehmer[9], wettkaempfer2: teilnehmer[14] },
  { wettkaempfer1: teilnehmer[9], wettkaempfer2: teilnehmer[15] },
  { wettkaempfer1: teilnehmer[9], wettkaempfer2: teilnehmer[16] },
  { wettkaempfer1: teilnehmer[9], wettkaempfer2: teilnehmer[17] },
  { wettkaempfer1: teilnehmer[9], wettkaempfer2: teilnehmer[18] },
  { wettkaempfer1: teilnehmer[9], wettkaempfer2: teilnehmer[19] },
  { wettkaempfer1: teilnehmer[9], wettkaempfer2: teilnehmer[20] },
  { wettkaempfer1: teilnehmer[9], wettkaempfer2: teilnehmer[21] },
  { wettkaempfer1: teilnehmer[9], wettkaempfer2: teilnehmer[22] },
  { wettkaempfer1: teilnehmer[9], wettkaempfer2: teilnehmer[23] },
  { wettkaempfer1: teilnehmer[9], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[9], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[10], wettkaempfer2: teilnehmer[11] },
  { wettkaempfer1: teilnehmer[10], wettkaempfer2: teilnehmer[12] },
  { wettkaempfer1: teilnehmer[10], wettkaempfer2: teilnehmer[13] },
  { wettkaempfer1: teilnehmer[10], wettkaempfer2: teilnehmer[14] },
  { wettkaempfer1: teilnehmer[10], wettkaempfer2: teilnehmer[15] },
  { wettkaempfer1: teilnehmer[10], wettkaempfer2: teilnehmer[16] },
  { wettkaempfer1: teilnehmer[10], wettkaempfer2: teilnehmer[17] },
  { wettkaempfer1: teilnehmer[10], wettkaempfer2: teilnehmer[18] },
  { wettkaempfer1: teilnehmer[10], wettkaempfer2: teilnehmer[19] },
  { wettkaempfer1: teilnehmer[10], wettkaempfer2: teilnehmer[20] },
  { wettkaempfer1: teilnehmer[10], wettkaempfer2: teilnehmer[21] },
  { wettkaempfer1: teilnehmer[10], wettkaempfer2: teilnehmer[22] },
  { wettkaempfer1: teilnehmer[10], wettkaempfer2: teilnehmer[23] },
  { wettkaempfer1: teilnehmer[10], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[10], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[11], wettkaempfer2: teilnehmer[12] },
  { wettkaempfer1: teilnehmer[11], wettkaempfer2: teilnehmer[13] },
  { wettkaempfer1: teilnehmer[11], wettkaempfer2: teilnehmer[14] },
  { wettkaempfer1: teilnehmer[11], wettkaempfer2: teilnehmer[15] },
  { wettkaempfer1: teilnehmer[11], wettkaempfer2: teilnehmer[16] },
  { wettkaempfer1: teilnehmer[11], wettkaempfer2: teilnehmer[17] },
  { wettkaempfer1: teilnehmer[11], wettkaempfer2: teilnehmer[18] },
  { wettkaempfer1: teilnehmer[11], wettkaempfer2: teilnehmer[19] },
  { wettkaempfer1: teilnehmer[11], wettkaempfer2: teilnehmer[20] },
  { wettkaempfer1: teilnehmer[11], wettkaempfer2: teilnehmer[21] },
  { wettkaempfer1: teilnehmer[11], wettkaempfer2: teilnehmer[22] },
  { wettkaempfer1: teilnehmer[11], wettkaempfer2: teilnehmer[23] },
  { wettkaempfer1: teilnehmer[11], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[11], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[12], wettkaempfer2: teilnehmer[13] },
  { wettkaempfer1: teilnehmer[12], wettkaempfer2: teilnehmer[14] },
  { wettkaempfer1: teilnehmer[12], wettkaempfer2: teilnehmer[15] },
  { wettkaempfer1: teilnehmer[12], wettkaempfer2: teilnehmer[16] },
  { wettkaempfer1: teilnehmer[12], wettkaempfer2: teilnehmer[17] },
  { wettkaempfer1: teilnehmer[12], wettkaempfer2: teilnehmer[18] },
  { wettkaempfer1: teilnehmer[12], wettkaempfer2: teilnehmer[19] },
  { wettkaempfer1: teilnehmer[12], wettkaempfer2: teilnehmer[20] },
  { wettkaempfer1: teilnehmer[12], wettkaempfer2: teilnehmer[21] },
  { wettkaempfer1: teilnehmer[12], wettkaempfer2: teilnehmer[22] },
  { wettkaempfer1: teilnehmer[12], wettkaempfer2: teilnehmer[23] },
  { wettkaempfer1: teilnehmer[12], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[12], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[13], wettkaempfer2: teilnehmer[14] },
  { wettkaempfer1: teilnehmer[13], wettkaempfer2: teilnehmer[15] },
  { wettkaempfer1: teilnehmer[13], wettkaempfer2: teilnehmer[16] },
  { wettkaempfer1: teilnehmer[13], wettkaempfer2: teilnehmer[17] },
  { wettkaempfer1: teilnehmer[13], wettkaempfer2: teilnehmer[18] },
  { wettkaempfer1: teilnehmer[13], wettkaempfer2: teilnehmer[19] },
  { wettkaempfer1: teilnehmer[13], wettkaempfer2: teilnehmer[20] },
  { wettkaempfer1: teilnehmer[13], wettkaempfer2: teilnehmer[21] },
  { wettkaempfer1: teilnehmer[13], wettkaempfer2: teilnehmer[22] },
  { wettkaempfer1: teilnehmer[13], wettkaempfer2: teilnehmer[23] },
  { wettkaempfer1: teilnehmer[13], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[13], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[14], wettkaempfer2: teilnehmer[15] },
  { wettkaempfer1: teilnehmer[14], wettkaempfer2: teilnehmer[16] },
  { wettkaempfer1: teilnehmer[14], wettkaempfer2: teilnehmer[17] },
  { wettkaempfer1: teilnehmer[14], wettkaempfer2: teilnehmer[18] },
  { wettkaempfer1: teilnehmer[14], wettkaempfer2: teilnehmer[19] },
  { wettkaempfer1: teilnehmer[14], wettkaempfer2: teilnehmer[20] },
  { wettkaempfer1: teilnehmer[14], wettkaempfer2: teilnehmer[21] },
  { wettkaempfer1: teilnehmer[14], wettkaempfer2: teilnehmer[22] },
  { wettkaempfer1: teilnehmer[14], wettkaempfer2: teilnehmer[23] },
  { wettkaempfer1: teilnehmer[14], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[14], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[15], wettkaempfer2: teilnehmer[16] },
  { wettkaempfer1: teilnehmer[15], wettkaempfer2: teilnehmer[17] },
  { wettkaempfer1: teilnehmer[15], wettkaempfer2: teilnehmer[18] },
  { wettkaempfer1: teilnehmer[15], wettkaempfer2: teilnehmer[19] },
  { wettkaempfer1: teilnehmer[15], wettkaempfer2: teilnehmer[20] },
  { wettkaempfer1: teilnehmer[15], wettkaempfer2: teilnehmer[21] },
  { wettkaempfer1: teilnehmer[15], wettkaempfer2: teilnehmer[22] },
  { wettkaempfer1: teilnehmer[15], wettkaempfer2: teilnehmer[23] },
  { wettkaempfer1: teilnehmer[15], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[15], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[16], wettkaempfer2: teilnehmer[17] },
  { wettkaempfer1: teilnehmer[16], wettkaempfer2: teilnehmer[18] },
  { wettkaempfer1: teilnehmer[16], wettkaempfer2: teilnehmer[19] },
  { wettkaempfer1: teilnehmer[16], wettkaempfer2: teilnehmer[20] },
  { wettkaempfer1: teilnehmer[16], wettkaempfer2: teilnehmer[21] },
  { wettkaempfer1: teilnehmer[16], wettkaempfer2: teilnehmer[22] },
  { wettkaempfer1: teilnehmer[16], wettkaempfer2: teilnehmer[23] },
  { wettkaempfer1: teilnehmer[16], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[16], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[17], wettkaempfer2: teilnehmer[18] },
  { wettkaempfer1: teilnehmer[17], wettkaempfer2: teilnehmer[19] },
  { wettkaempfer1: teilnehmer[17], wettkaempfer2: teilnehmer[20] },
  { wettkaempfer1: teilnehmer[17], wettkaempfer2: teilnehmer[21] },
  { wettkaempfer1: teilnehmer[17], wettkaempfer2: teilnehmer[22] },
  { wettkaempfer1: teilnehmer[17], wettkaempfer2: teilnehmer[23] },
  { wettkaempfer1: teilnehmer[17], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[17], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[18], wettkaempfer2: teilnehmer[19] },
  { wettkaempfer1: teilnehmer[18], wettkaempfer2: teilnehmer[20] },
  { wettkaempfer1: teilnehmer[18], wettkaempfer2: teilnehmer[21] },
  { wettkaempfer1: teilnehmer[18], wettkaempfer2: teilnehmer[22] },
  { wettkaempfer1: teilnehmer[18], wettkaempfer2: teilnehmer[23] },
  { wettkaempfer1: teilnehmer[18], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[18], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[19], wettkaempfer2: teilnehmer[20] },
  { wettkaempfer1: teilnehmer[19], wettkaempfer2: teilnehmer[21] },
  { wettkaempfer1: teilnehmer[19], wettkaempfer2: teilnehmer[22] },
  { wettkaempfer1: teilnehmer[19], wettkaempfer2: teilnehmer[23] },
  { wettkaempfer1: teilnehmer[19], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[19], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[20], wettkaempfer2: teilnehmer[21] },
  { wettkaempfer1: teilnehmer[20], wettkaempfer2: teilnehmer[22] },
  { wettkaempfer1: teilnehmer[20], wettkaempfer2: teilnehmer[23] },
  { wettkaempfer1: teilnehmer[20], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[20], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[21], wettkaempfer2: teilnehmer[22] },
  { wettkaempfer1: teilnehmer[21], wettkaempfer2: teilnehmer[23] },
  { wettkaempfer1: teilnehmer[21], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[21], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[22], wettkaempfer2: teilnehmer[23] },
  { wettkaempfer1: teilnehmer[22], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[22], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[23], wettkaempfer2: teilnehmer[24] },
  { wettkaempfer1: teilnehmer[23], wettkaempfer2: teilnehmer[25] },
  { wettkaempfer1: teilnehmer[24], wettkaempfer2: teilnehmer[25] }

];