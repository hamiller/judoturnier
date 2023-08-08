import { Wettkaempfer } from "../model/wettkaempfer";
import { Verein } from "../model/verein";
import { WettkaempferRepository } from "../adapter/secondary/wettkaempfer.repository";
import { getLogger } from './logger';
import { VereinRepository } from "../adapter/secondary/verein.repository";
import { Geschlecht } from "../model/geschlecht";
import { altersklasseSortOrder } from "../model/altersklasse";
import DatabasePool from "../config/db.config";

const logger = getLogger('WiegenService');
const pool: DatabasePool = new DatabasePool();
const wettkaempferRepo = new WettkaempferRepository(pool);
const vereinRepo = new VereinRepository(pool);
export class WiegenService {

  
  async alleKaempfer(): Promise<Wettkaempfer[]> {
    let kaempfer = await wettkaempferRepo.all();
    kaempfer.sort((a, b) => {
      if (a.geschlecht === b.geschlecht) {
        return altersklasseSortOrder[a.altersklasse] - altersklasseSortOrder[b.altersklasse];
      }
      return a.geschlecht === Geschlecht.w ? -1 : 1;
    });
    return kaempfer;
  }

  async ladeKaempfer(id: Number): Promise<Wettkaempfer | null> {
    return await wettkaempferRepo.find(id);
  }

  async speichereKaempfer(wettkaempfer: Wettkaempfer): Promise<Number> {
    return await wettkaempferRepo.save(wettkaempfer);
  }

  async loescheKaempfer(id: Number): Promise<void> {
    return await wettkaempferRepo.delete(id);
  }

  async alleVereine(): Promise<Verein[] | null> {
    return await vereinRepo.all();
  }
}