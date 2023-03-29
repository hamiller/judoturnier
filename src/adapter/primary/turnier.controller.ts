import { Response } from 'express';
import { Controller, Get, Post, Delete, OnUndefined, Body, Render, Res, Param } from "routing-controllers";
import { getLogger } from "../../application/logger";
import { WiegenService } from '../../application/wiegen.service';
import { TurnierService } from '../../application/turnier.service';
import { Wettkaempfer } from '../../model/wettkaempfer';

const logger = getLogger('TurnierController');
const wiegenService = new WiegenService();
const turnierService = new TurnierService();

@Controller()
export class TurnierController {

  @Get('/')
  @Render("index.hbs")
  async default(@Res() res: Response) {
    return { };
  }

  @Get('/turnieruebersicht')
  @Render("turnieruebersicht.hbs")
  async ladeTurnieruebersicht(@Res() res: Response) {
    logger.debug('Turnierübersicht angefragt');
    const wks = await wiegenService.alleGewogenenKaempfer();
    return { anzahl: wks.length };
  }

  @Post('/turnier')
  @Render("turnieruebersicht.hbs")
  async erstelleWettkampfGruppen(@Res() res: Response) {
    logger.debug('erstelle WettkampfGruppen');
    const wks = await wiegenService.alleGewogenenKaempfer();
    const wettkampfGruppen = turnierService.erstelleGruppen(wks);
    return { wettkampfGruppen: wettkampfGruppen };
  }
}