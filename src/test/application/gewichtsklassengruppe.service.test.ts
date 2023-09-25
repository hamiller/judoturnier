import assert from 'assert';
import { GewichtsklassenGruppeService } from "../../main/application/gewichtsklassengruppe.service";
import { Altersklasse } from "../../main/model/altersklasse";
import { Geschlecht } from "../../main/model/geschlecht";
import { Wettkaempfer } from "../../main/model/wettkaempfer";

describe('Erstellen von Gruppen', () => {

  const service = new GewichtsklassenGruppeService();
  const teilnehmer: Wettkaempfer[] = [
    { name: 'Teilnehmer A', geschlecht: Geschlecht.m, id: 1, verein: { name: "Verein1" }, altersklasse: Altersklasse.U11, gewicht: 23.4 },
    { name: 'Teilnehmer B', geschlecht: Geschlecht.m, id: 2, verein: { name: "Verein2" }, altersklasse: Altersklasse.U11, gewicht: 23.4 },
    { name: 'Teilnehmer C', geschlecht: Geschlecht.m, id: 3, verein: { name: "Verein3" }, altersklasse: Altersklasse.U11, gewicht: 23.4 },
    { name: 'Teilnehmer D', geschlecht: Geschlecht.m, id: 4, verein: { name: "Verein4" }, altersklasse: Altersklasse.U11, gewicht: 23.4 },
    { name: 'Teilnehmer E', geschlecht: Geschlecht.m, id: 5, verein: { name: "Verein5" }, altersklasse: Altersklasse.U11, gewicht: 23.4 },
    { name: 'Teilnehmer F', geschlecht: Geschlecht.w, id: 6, verein: { name: 'Verein2' }, altersklasse: Altersklasse.U11, gewicht: 23.4 },

    { name: 'Teilnehmer G', geschlecht: Geschlecht.w, id: 7, verein: { name: 'Verein3' }, altersklasse: Altersklasse.U11, gewicht: 23.4 },
    { name: 'Teilnehmer H', geschlecht: Geschlecht.m, id: 8, verein: { name: 'Verein4' }, altersklasse: Altersklasse.U11, gewicht: 23.4 },
    { name: 'Teilnehmer I', geschlecht: Geschlecht.w, id: 9, verein: { name: 'Verein1' }, altersklasse: Altersklasse.U11, gewicht: 23.4 },
    { name: 'Teilnehmer J', geschlecht: Geschlecht.m, id: 10, verein: { name: 'Verein5' }, altersklasse: Altersklasse.U11, gewicht: 23.4 },
    { name: 'Teilnehmer K', geschlecht: Geschlecht.w, id: 11, verein: { name: 'Verein3' }, altersklasse: Altersklasse.U11, gewicht: 23.4 },
    { name: 'Teilnehmer L', geschlecht: Geschlecht.m, id: 12, verein: { name: 'Verein2' }, altersklasse: Altersklasse.U11, gewicht: 23.4 },

    { name: 'Teilnehmer M', geschlecht: Geschlecht.w, id: 13, verein: { name: 'Verein4' }, altersklasse: Altersklasse.U11, gewicht: 23.4 },
    { name: 'Teilnehmer N', geschlecht: Geschlecht.m, id: 14, verein: { name: 'Verein5' }, altersklasse: Altersklasse.U11, gewicht: 23.4 },
    { name: 'Teilnehmer O', geschlecht: Geschlecht.m, id: 15, verein: { name: 'Verein1' }, altersklasse: Altersklasse.U11, gewicht: 23.4 },
    { name: 'Teilnehmer P', geschlecht: Geschlecht.w, id: 16, verein: { name: 'Verein3' }, altersklasse: Altersklasse.U11, gewicht: 23.4 },
    { name: 'Teilnehmer Q', geschlecht: Geschlecht.m, id: 17, verein: { name: 'Verein2' }, altersklasse: Altersklasse.U11, gewicht: 23.4 },
    { name: 'Teilnehmer R', geschlecht: Geschlecht.w, id: 18, verein: { name: 'Verein1' }, altersklasse: Altersklasse.U11, gewicht: 23.4 },

    { name: 'Teilnehmer S', geschlecht: Geschlecht.m, id: 19, verein: { name: 'Verein4' }, altersklasse: Altersklasse.U11, gewicht: 23.4 },
    { name: 'Teilnehmer T', geschlecht: Geschlecht.w, id: 20, verein: { name: 'Verein5' }, altersklasse: Altersklasse.U11, gewicht: 23.4 },
    { name: 'Teilnehmer U', geschlecht: Geschlecht.m, id: 21, verein: { name: 'Verein2' }, altersklasse: Altersklasse.U11, gewicht: 23.4 },
    { name: 'Teilnehmer V', geschlecht: Geschlecht.w, id: 22, verein: { name: 'Verein3' }, altersklasse: Altersklasse.U11, gewicht: 23.4 },
    { name: 'Teilnehmer W', geschlecht: Geschlecht.m, id: 23, verein: { name: 'Verein1' }, altersklasse: Altersklasse.U11, gewicht: 23.4 },
    { name: 'Teilnehmer X', geschlecht: Geschlecht.w, id: 24, verein: { name: 'Verein4' }, altersklasse: Altersklasse.U11, gewicht: 23.4 },
    
    { name: 'Teilnehmer Y', geschlecht: Geschlecht.m, id: 25, verein: { name: 'Verein5' }, altersklasse: Altersklasse.U11, gewicht: 23.4 }
  ];
  

  it('korrekt erstellt ', async () => {
    const gewichtsKlassenGruppen = await service.teileInGewichtsklassen(teilnehmer);
    console.log(gewichtsKlassenGruppen)
    assert.equal(gewichtsKlassenGruppen.length, 5);
  });

});