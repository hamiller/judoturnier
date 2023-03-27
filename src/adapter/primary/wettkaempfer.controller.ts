import { Request, Response } from 'express';
import { Controller, Get, Render, Req, Res } from "routing-controllers";
import { getLogger } from "../../application/logger";
import { WiegenService } from '../../application/wiegen.service';

const logger = getLogger('WettkaempferController');
const wiegenService = new WiegenService();

@Controller()
export class WettkaempferController {

  @Get('/wettkaempfer')
  @Render("wettkaempferliste.hbs")
  async ladeWettkaempferListe(@Res() res: Response) {
    logger.debug('Wettkaempfer-Seite angefragt');
    return { kaempferListe: wiegenService.alleGewogenenKaempfer() };
  }

  @Get('/wettkaempfer/:id')
  @Render("wettkaempfer.hbs")
  async ladeWettkaempfer(@Req() req: Request, @Res() res: Response) {
    logger.debug('Wettkaempfer-Seite angefragt');
    return { subject: 'hbs template engine' };
  }

  @Get('/test')
  getSomething(@Req() request: Request, @Res() response: Response) {
    return response.send('Hello response!');
  }
};