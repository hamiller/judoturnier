import { Wettkaempfer } from "../model/wettkaempfer";
import { WiegenRepository } from "../adapter/secondary/wiegen.repository";
import { getLogger } from './logger';

const logger = getLogger('WiegenService');
const wiegenRepo = new WiegenRepository();

export class WiegenService {

  
  async alleGewogenenKaempfer(): Promise<Wettkaempfer[]> {
    logger.debug("hole alle gewogenen Kämpfer");

    return wiegenRepo.all();
  }
}