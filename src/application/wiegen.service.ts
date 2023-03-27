import { Wettkaempfer } from "../model/wettkaempfer";
import { Verein } from "../model/verein";
import { WettkaempferRepository } from "../adapter/secondary/wettkaempfer.repository";
import { getLogger } from './logger';
import { VereinRepository } from "../adapter/secondary/verein.repository";

const logger = getLogger('WiegenService');
const wettkaempferRepo = new WettkaempferRepository();
const vereinRepo = new VereinRepository();
export class WiegenService {

  
  async alleGewogenenKaempfer(): Promise<Wettkaempfer[]> {
    let kaempfer = await wettkaempferRepo.all();
    kaempfer.sort((a, b) => {
      if (a.geschlecht === b.geschlecht) {
        return a.alter - b.alter;
      }
      return a.geschlecht === 'w' ? -1 : 1;
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