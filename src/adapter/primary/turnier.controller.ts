import { Response } from 'express';
import { Controller, Get, Post, QueryParam, Render, Res } from "routing-controllers";
import { getLogger } from "../../application/logger";
import { WiegenService } from '../../application/wiegen.service';
import { TurnierService } from '../../application/turnier.service';
import { Geschlecht } from '../../model/geschlecht';
import { Kampfsystem } from '../../model/kampfsystem';

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
  async erstelleWettkampfGruppen(@QueryParam('geschlecht') geschlecht: string, @Res() res: Response) {
    logger.debug('erstelle WettkampfGruppen', {geschlecht: geschlecht});
    const wks = await wiegenService.alleKaempfer();
    const gwks = turnierService.teileInGewichtsklassen(wks);
    
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

  @Get('/turnier/kampfsystem')
  @Render("kampfsystem.hbs")
  async konfiguriereKampfsysteme(@Res() res: Response) {
    logger.debug('Kapmfsystem');
    const wks = await wiegenService.alleKaempfer();
    const gwks = turnierService.teileInGewichtsklassen(wks);
    return { 
      gewichtsklassengruppen: gwks, 
      anzahlwk: wks.length,
      kampfsysteme: Kampfsystem
    };
  }
}