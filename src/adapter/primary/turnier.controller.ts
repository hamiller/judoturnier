import { Response } from 'express';
import { Controller, Get, Post, Delete, OnUndefined, Body, Render, Res, Param } from "routing-controllers";
import { getLogger } from "../../application/logger";
import { WiegenService } from '../../application/wiegen.service';
import { TurnierService } from '../../application/turnier.service';
import { Wettkaempfer } from '../../model/wettkaempfer';
import { Geschlecht } from '../../model/geschlecht';

const logger = getLogger('TurnierController');
const wiegenService = new WiegenService();
const turnierService = new TurnierService();

@Controller()
export class TurnierController {

  @Get('/')
  @Render("turnieruebersicht.hbs")
  async ladeTurnieruebersicht(@Res() res: Response) {
    logger.debug('Turnierübersicht angefragt');
    const wks = await wiegenService.alleKaempfer();
    return { anzahlwk: wks.length, con: "guble2" };
  }

  @Post('/turnier/wettkampfgruppen')
  @Render("turnieruebersicht.hbs")
  async erstelleWettkampfGruppen(@Res() res: Response) {
    logger.debug('erstelle WettkampfGruppen');
    const wks = await wiegenService.alleKaempfer();
    const wettkampfGruppen = turnierService.erstelleGruppen(wks);
    return { anzahlwk: wks.length, wettkampfgruppen: wettkampfGruppen };
  }

  @Get('/turnier/gewichtsklassen')
  @Render("gewichtsklassen.hbs")
  async erstelleGewichtsklassen(@Res() res: Response) {
    logger.debug('erstelle Gewichtsklassen');
    const wks = await wiegenService.alleKaempfer();
    const gwks = turnierService.teileInGewichtsklassen(wks);
    return { 
      gewichtsklassengruppenWeiblich: gwks.filter(gruppe => gruppe.gruppenGeschlecht == Geschlecht.w), 
      gewichtsklassengruppenMaennlich: gwks.filter(gruppe => gruppe.gruppenGeschlecht == Geschlecht.m), 
      anzahlwk: wks.length 
    };
  }
}