import { Altersklasse } from "../model/altersklasse";
import { Geschlecht } from "../model/geschlecht";
import { Wettkaempfer } from "../model/wettkaempfer";
import { WettkampfGruppe } from "../model/wettkampfgruppe";
import { getLogger } from './logger';
import { RoundRobin } from "./round-robin";

const logger = getLogger('TurnierService');
const algorithmus = new RoundRobin();

export class TurnierService {

  erstelleGruppen(wettkaempferListe: Wettkaempfer[]): WettkampfGruppe[] {
    logger.debug("Erstelle Gruppen...");

    let u9W = this.filter(wettkaempferListe, Geschlecht.w, Altersklasse.U9);

    const begegnungenU9M = algorithmus.berechneMatch(this.filter(wettkaempferListe, Geschlecht.w, Altersklasse.U9));
    const c: WettkampfGruppe = {id:1, name:"Kampfgruppe1", typ:"4er", begegnungen:begegnungenU9M };

    return [c];
  }

  private filter(liste: Wettkaempfer[], geschlecht: Geschlecht, altersklasse: Altersklasse): Wettkaempfer[] {
    return liste
      .filter(wk => { return wk.geschlecht === geschlecht && wk.altersklasse === altersklasse})
      .sort((a,b) => {
        if (a.gewicht) {
          if (b.gewicht) {
            return a.gewicht - b.gewicht
          }
          return 1;
        }
        if (b.gewicht) {
          return -1;
        }
        return 0;
      });
  }
}